import { z } from 'zod';

const createPetProfileSchema = z.object({
  name: z.string({ required_error: 'Name is required' }),
  user: z.string({ required_error: 'User is required' }),
  breed: z.string({ required_error: 'Breed is required' }),
  preference: z.string({ required_error: 'Preference is required' }),
  weight: z.string({ required_error: 'Weight is required' }),
  neck: z.string({ required_error: 'Neck is required' }),
  coller: z.string({ required_error: 'Coller is required' }),
  chest: z.string({ required_error: 'Chest is required' }),
});

export const PetProfileValidation = {
  createPetProfileSchema,
};
