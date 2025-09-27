import { Module, type Provider } from "@nestjs/common";
import { PingCommand } from "./handlers/ping.command";

const HANDLERS: Provider[] = [PingCommand];

@Module({
  providers: [...HANDLERS],
})
export class CommandsModule {}
