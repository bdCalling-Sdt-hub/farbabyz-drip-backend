import { JwtPayload } from 'jsonwebtoken';
import { Notification } from './notification.model';
import { SortOrder } from 'mongoose';

const getNotificationToDb = async (user: JwtPayload) => {
  const result = await Notification.find({ receiver: user.id });

  const unredCount = await Notification.countDocuments({
    receiver: user.id,
    read: false,
  });

  const data = {
    result,
    unredCount,
  };

  return data;
};

const readNotification = async (user: JwtPayload) => {
  const result = await Notification.updateMany(
    { receiver: user.id },
    { read: true }
  );
  return result;
};

// const adminNotification = async () => {
//   const result = await Notification.find({ type: 'ADMIN' });
//   return result;
// };

const adminNotification = async (query: Record<string, unknown>) => {
  const {
    page,
    limit,
    sortBy = 'createdAt',
    order = 'desc',
    ...filterData
  } = query;
  const anyConditions: any[] = [];

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

  const result = await Notification.find(whereConditions)

    .sort(sortCondition)
    .skip(skip)
    .limit(size)
    .lean();
  const count = await Notification.countDocuments(whereConditions);

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

const adminReadNotification = async () => {
  const result = await Notification.updateMany(
    { type: 'ADMIN' },
    { read: true }
  );
  return result;
};

export const NotificationService = {
  getNotificationToDb,
  readNotification,
  adminNotification,
  adminReadNotification,
};
