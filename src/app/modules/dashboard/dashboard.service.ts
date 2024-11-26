import { populate } from 'dotenv';
import { Payment } from '../payment/payment.model';
import { Product } from '../product/product.model';
import { User } from '../user/user.model';

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
    // { $match: { status: 'active' } },
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

const getRecentTransaction = async () => {
  const result = await Payment.find()
    .populate({
      path: 'user',
      select: 'name',
    })
    .populate({
      path: 'products.productId',
      select: 'name price image',
    })
    .sort({ createdAt: -1 })
    .limit(5);
  return result;
};

export const DashboardService = {
  totalStatistics,
  getEarningChartData,
  getRecentTransaction,
};
