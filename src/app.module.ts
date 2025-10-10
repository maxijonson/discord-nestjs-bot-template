import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { BotModule } from "./bot/bot.module";
import { CommandsModule } from "./commands/commands.module";
import { EnvModule } from "./env/env.module";
import { ListenersModule } from "./listeners/listeners.module";
import { APP_FILTER } from "@nestjs/core";
import { AppExceptionFilter } from "./common/filters/app-exception.filter";
import { ComponentsModule } from "./components/components.module";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
  imports: [ScheduleModule.forRoot(), EnvModule, BotModule, CommandsModule, ListenersModule, ComponentsModule],
  providers: [AppService, { provide: APP_FILTER, useClass: AppExceptionFilter }],
  controllers: [AppController],
})
export class AppModule {}
