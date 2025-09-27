import { nonEmptyString } from "src/utils/schemas/non-empty-string.schema";
import { z } from "zod";

export const Env = z.object({
  /** The environment the app is running in */
  NEST_ENV: z
    .enum(["development", "staging", "production"])
    .optional()
    .default(process.env.NODE_ENV === "development" ? "development" : "production"),

  /** The port the application will run on */
  PORT: z.coerce.number().int().min(1).max(65535).optional().default(3000),

  /** Discord bot token */
  DISCORD_BOT_TOKEN: nonEmptyString,

  /** A Discord server (guild) ID to use for development */
  DEVELOPMENT_GUILD_ID: nonEmptyString.optional(),

  /** Railway provided variables */
  RAILWAY_PUBLIC_DOMAIN: nonEmptyString.optional(),
  RAILWAY_PRIVATE_DOMAIN: nonEmptyString.optional(),
  RAILWAY_PROJECT_NAME: nonEmptyString.optional(),
  RAILWAY_ENVIRONMENT_NAME: nonEmptyString.optional(),
  RAILWAY_SERVICE_NAME: nonEmptyString.optional(),
  RAILWAY_PROJECT_ID: nonEmptyString.optional(),
  RAILWAY_ENVIRONMENT_ID: nonEmptyString.optional(),
  RAILWAY_SERVICE_ID: nonEmptyString.optional(),
});

export type Env = z.infer<typeof Env>;
