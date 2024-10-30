import { IRetrun, ITerms } from './setting.interface';
import { Return, TermsAndCondition } from './setting.model';

const createTermsAndCondition = async (payload: Partial<ITerms>) => {
  try {
    const existingTerm = await TermsAndCondition.findOne();

    if (existingTerm) {
      Object.assign(existingTerm, payload);
      const updatedTerm = await existingTerm.save();
      return updatedTerm;
    } else {
      const newTerm = await TermsAndCondition.create(payload);
      return newTerm;
    }
  } catch (error) {
    throw new Error('Unable to create or update terms and condition.');
  }
};

const createReturnPolicy = async (payload: Partial<IRetrun>) => {
  try {
    const existingTerm = await Return.findOne();

    if (existingTerm) {
      Object.assign(existingTerm, payload);
      const updatedTerm = await existingTerm.save();
      return updatedTerm;
    } else {
      const newTerm = await Return.create(payload);
      return newTerm;
    }
  } catch (error) {
    throw new Error('Unable to create or update Return Policy.');
  }
};

export const SettingService = {
  createTermsAndCondition,
  createReturnPolicy,
};
