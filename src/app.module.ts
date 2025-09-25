import { Module } from "@nestjs/common";
import { AppService } from "./app.service";
import { EnvModule } from "./env/env.module";
import { ConfigModule } from "@nestjs/config";
import { Env } from "./env/env";
import { NecordModule } from "necord";
import { IntentsBitField } from "discord.js";

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => Env.parse(env),
      isGlobal: true,
    }),
    EnvModule,
    NecordModule.forRoot({
      token: process.env.DISCORD_BOT_TOKEN!,
      intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMembers],
    }),
  ],
  providers: [AppService],
})
export class AppModule {}
