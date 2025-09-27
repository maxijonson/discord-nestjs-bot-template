import { Module } from "@nestjs/common";
import { NecordModule } from "necord";
import { EnvService } from "src/env/env.service";

@Module({
  imports: [
    NecordModule.forRootAsync({
      inject: [EnvService],
      useFactory: (envService: EnvService) => ({
        token: envService.get("DISCORD_BOT_TOKEN"),
        development:
          envService.get("NEST_ENV") !== "production" && envService.get("DEVELOPMENT_GUILD_ID")
            ? [envService.get("DEVELOPMENT_GUILD_ID")!]
            : undefined,
        intents: [],
      }),
    }),
  ],
})
export class BotModule {}
