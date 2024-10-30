import catchAsync from '../../../shared/catchAsync';
import { SettingService } from './setting.service';

const createTermsAndCondition = catchAsync(async (req, res) => {
  const result = await SettingService.createTermsAndCondition(req.body);
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Terms and condition created successfully',
    data: result,
  });
});

const createReturnPolicy = catchAsync(async (req, res) => {
  const result = await SettingService.createReturnPolicy(req.body);
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Return policy created successfully',
    data: result,
  });
});

export const SettingController = {
  createTermsAndCondition,
  createReturnPolicy,
};
