import { z } from "zod";
export const reportSchema = z.object({ targetType: z.enum(["WORK", "COMMENT", "USER"]), targetId: z.string().cuid(), reason: z.enum(["PORNOGRAPHY", "VIOLENCE", "HARMFUL_INDUCEMENT", "SPAM", "COPYRIGHT", "HARASSMENT", "OTHER"]), description: z.string().trim().max(500).optional() });
