import { Module, type Provider } from "@nestjs/common";
import { ReadyEvent } from "./handlers/ready.event";

const HANDLERS: Provider[] = [ReadyEvent];

@Module({
  providers: [...HANDLERS],
})
export class EventsModule {}
