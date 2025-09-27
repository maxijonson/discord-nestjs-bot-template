import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { BotModule } from "./bot/bot.module";
import { CommandsModule } from "./commands/commands.module";
import { EnvModule } from "./env/env.module";
import { EventsModule } from "./events/events.module";

@Module({
  imports: [EnvModule, BotModule, CommandsModule, EventsModule],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
