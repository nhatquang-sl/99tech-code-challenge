import z from 'zod';

export const UpdateUserCommandSchema = z.object({
  id: z.number({ message: 'Invalid user ID.' }).min(1, { message: 'Invalid user ID.' }),
  firstName: z.string().trim().min(1, { message: 'First name is required.' }),
  lastName: z.string().trim().optional(),
});
