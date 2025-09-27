import { Module, type Provider } from "@nestjs/common";
import { PingCommand } from "./handlers/ping.command";
import { EchoCommand } from "./handlers/echo.command";
import { WhatisCommand } from "./handlers/whatis.command";
import { PurgeCommand } from "./handlers/purge.command";

const HANDLERS: Provider[] = [PingCommand, EchoCommand, WhatisCommand, PurgeCommand];

@Module({
  providers: [...HANDLERS],
})
export class CommandsModule {}
