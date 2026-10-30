import { z } from "zod";

const marketSchema = z
    .object({
        title: z.string().min(10),
        side: z.boolean(),
        initialWager: z.number().positive(),
    })
    .strict();

const betSchema = z
    .object({
        marketId: z.string(),
        betAmount: z.number().positive(),
    })
    .strict();

export { marketSchema, betSchema };
