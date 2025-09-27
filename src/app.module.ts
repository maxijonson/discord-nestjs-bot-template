import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { BotModule } from "./bot/bot.module";
import { CommandsModule } from "./commands/commands.module";
import { EnvModule } from "./common/env/env.module";
import { EventsModule } from "./events/events.module";
import { APP_FILTER } from "@nestjs/core";
import { AppExceptionFilter } from "./common/filters/app-exception.filter";

@Module({
  imports: [EnvModule, BotModule, CommandsModule, EventsModule],
  providers: [AppService, { provide: APP_FILTER, useClass: AppExceptionFilter }],
  controllers: [AppController],
})
export class AppModule {}
