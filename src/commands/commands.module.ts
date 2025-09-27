import { Module, type Provider } from "@nestjs/common";
import { PingCommand } from "./handlers/ping.command";
import { EchoCommand } from "./handlers/echo.command";

const HANDLERS: Provider[] = [PingCommand, EchoCommand];

@Module({
  providers: [...HANDLERS],
})
export class CommandsModule {}
