import { Module, type Provider } from "@nestjs/common";

const HANDLERS: Provider[] = [];

@Module({
  providers: [...HANDLERS],
})
export class ComponentsModule {}
