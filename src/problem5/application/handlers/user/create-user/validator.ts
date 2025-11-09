import z from 'zod';

export const CreateUserCommandSchema = z.object({
  firstName: z.string().trim().min(1, { message: 'First name is required.' }),
  lastName: z.string().trim().optional(),
  emailAddress: z
    .email()
    .trim()
    .max(255, { message: 'Email has reached a maximum of 255 characters.' }),
  password: z
    .string()
    .trim()
    .min(6, { message: 'Password must be at least 6 characters.' })
    .regex(/[a-z]/g, { message: "Password must have at least one lowercase ('a'-'z')." })
    .regex(/[A-Z]/g, { message: "Password must have at least one uppercase ('A'-'Z')." })
    .regex(/[0-9]/g, { message: 'Password must contain at least one number.' })
    .regex(/[!@#$%^&*()_+=\[{\]};:<>|./?,-]/g, {
      message: 'Password must have at least one non alphanumeric character.',
    })
    .max(50, { message: 'Password has reached a maximum of 50 characters.' }),
});
