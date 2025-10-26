import { Module } from "@nestjs/common";
import { IntentsBitField } from "discord.js";
import { NecordModule } from "necord";
import { EnvService } from "src/env/env.service";

@Module({
  imports: [
    NecordModule.forRootAsync({
      inject: [EnvService],
      useFactory: (envService: EnvService) => ({
        token: envService.get("DISCORD_BOT_TOKEN"),
        development: (() => {
          if (envService.get("NEST_ENV") === "production") return undefined;
          const guildIds = envService.get("DISCORD_DEVELOPMENT_GUILD_ID") || [];
          if (guildIds.length > 0) return guildIds;
          return undefined;
        })(),
        intents: [
          IntentsBitField.Flags.Guilds,
          /** This is a privileged gateway intent - Enable "Server Members Intent" in the Bot tab of your Discord Application */
          IntentsBitField.Flags.GuildMembers,
        ],
      }),
    }),
  ],
})
export class BotModule {}
