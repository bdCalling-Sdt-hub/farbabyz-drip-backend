import { IPetProfile } from './petProfile.intertface';
import { PetProfile } from './petProfile.model';

const createPetProfileIntoDb = async (
  payload: IPetProfile
): Promise<IPetProfile> => {
  const result = await PetProfile.create(payload);
  return result;
};

export const PetProfileService = {
  createPetProfileIntoDb,
};
