import { Module, type Provider } from "@nestjs/common";
import { ReadyListener } from "./handlers/ready.listener";

const HANDLERS: Provider[] = [ReadyListener];

@Module({
  providers: [...HANDLERS],
})
export class ListenersModule {}
