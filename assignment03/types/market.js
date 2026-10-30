import { z } from "zod";

const marketSchema = z
    .object({
        title: z.string().min(10),
        side: z.boolean(),
        initialWager: z.number().positive(),
    })
    .strict();

export default marketSchema;
