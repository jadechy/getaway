import { z } from "zod";
import { FirestoreUserSchema } from "./user";

export const LoginRequestSchema = z.object({
  username: FirestoreUserSchema.shape.util_mail,
  password: z.string().min(6, "Le mot de passe est requis"),
});

export type LoginRequestType = z.infer<typeof LoginRequestSchema>;