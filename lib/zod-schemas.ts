import { z } from "zod";

export const profileFormSchema = z.object({
  firstName: z.string().min(2, { message: "First Name should have at least 2 characters." }),
  lastName: z.string().optional(),
  imgUrl: z.string().optional(),
  emailAddress: z.string().email({
    message: "Invalid email address.",
  }),
});
