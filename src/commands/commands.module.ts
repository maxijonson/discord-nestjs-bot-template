import { Module, type Provider } from "@nestjs/common";
import { PingCommand } from "./handlers/ping.command";
import { EchoCommand } from "./handlers/echo.command";
import { WhatisCommand } from "./handlers/whatis.command";
import { PurgeCommand } from "./handlers/purge.command";
import { UploadCommand } from "./handlers/upload.command";

const HANDLERS: Provider[] = [PingCommand, EchoCommand, WhatisCommand, PurgeCommand, UploadCommand];

@Module({
  providers: [...HANDLERS],
})
export class CommandsModule {}
