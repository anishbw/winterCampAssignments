import { z } from "zod";

const signUpSchema = z
    .object({
        username: z.string().trim().min(3),
        password: z.string().min(6),
    })
    .strict();

const signInSchema = z
    .object({
        username: z.string().trim(),
        password: z.string(),
    })
    .strict();

export { signUpSchema, signInSchema };
