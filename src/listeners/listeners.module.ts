import { Module, type Provider } from "@nestjs/common";
import { ClientReadyListener } from "./handlers/client-ready.listener";

const HANDLERS: Provider[] = [ClientReadyListener];

@Module({
  providers: [...HANDLERS],
})
export class ListenersModule {}
