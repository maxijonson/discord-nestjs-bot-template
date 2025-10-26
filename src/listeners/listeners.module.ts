import { Module, type Provider } from "@nestjs/common";
import { ClientReadyListener } from "./handlers/client-ready.listener";
import { GuildMemberAddListener } from "./handlers/guildMemberAdd.listener";

const HANDLERS: Provider[] = [ClientReadyListener, GuildMemberAddListener];

@Module({
  providers: [...HANDLERS],
})
export class ListenersModule {}
