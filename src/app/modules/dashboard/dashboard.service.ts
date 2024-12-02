import { populate } from 'dotenv';
import { Payment } from '../payment/payment.model';
import { Product } from '../product/product.model';
import { User } from '../user/user.model';
import { SortOrder } from 'mongoose';

const totalStatistics = async () => {
  const [totalEarnings, totalUsers, totalProducts] = await Promise.all([
    Payment.aggregate([
      // { $match: { status: 'active' } },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
        },
      },
    ]).then(result => (result.length > 0 ? result[0].totalAmount : 0)),

    User.countDocuments(),

    Product.countDocuments(),
  ]);

  return {
    totalEarnings,
    totalUsers,
    totalProducts,
  };
};

const getEarningChartData = async () => {
  const result = await Payment.aggregate([
    { $match: { status: 'succeeded' } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        totalAmount: { $sum: '$amount' },
      },
    },
    {
      $addFields: {
        month: {
          $dateToString: {
            format: '%b',
            date: { $dateFromString: { dateString: '$_id' } },
          },
        },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);
  return result;
};

// const getRecentTransaction = async () => {
//   const result = await Payment.find({ status: 'succeeded' })
//     .populate({
//       path: 'user',
//       select: 'name',
//     })
//     .populate({
//       path: 'products.productId',
//       select: 'name price image',
//     })
//     .sort({ createdAt: -1 })
//     .limit(5);
//   return result;
// };

const getRecentTransaction = async (query: Record<string, unknown>) => {
  const {
    searchTerm,
    page,
    limit,
    sortBy = 'createdAt',
    order = 'desc',
    ...filterData
  } = query;
  const anyConditions: any[] = [];

  if (searchTerm) {
    anyConditions.push({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
      ],
    });
  }

  anyConditions.push({ status: 'succeeded' });

  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.entries(filterData).map(
      ([field, value]) => ({
        [field]: value,
      })
    );
    anyConditions.push({ $and: filterConditions });
  }

  // Apply filter conditions
  const whereConditions =
    anyConditions.length > 0 ? { $and: anyConditions } : {};
  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  // Set default sort order to show new data first
  const sortOrder: SortOrder = order === 'desc' ? -1 : 1;
  const sortCondition: { [key: string]: SortOrder } = {
    [sortBy as string]: sortOrder,
  };

  const result = await Payment.find(whereConditions)
    .populate({
      path: 'products.productId',
      select: 'name image price',
    })
    .populate({
      path: 'user',
      select: 'name email',
    })
    .select('amount products user createdAt')
    .sort(sortCondition)
    .skip(skip)
    .limit(size)
    .lean();
  const count = await Payment.countDocuments(whereConditions);

  const data: any = {
    result,
    meta: {
      page: pages,
      limit: size,
      total: count,
      totalPages: Math.ceil(count / size),
      currentPage: pages,
    },
  };
  return data;
};

export const DashboardService = {
  totalStatistics,
  getEarningChartData,
  getRecentTransaction,
};
