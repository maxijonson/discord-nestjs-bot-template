import { Module } from "@nestjs/common";
import { AppService } from "./app.service";
import { EnvModule } from "./env/env.module";
import { ConfigModule } from "@nestjs/config";
import { Env } from "./env/env";

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => Env.parse(env),
      isGlobal: true,
    }),
    EnvModule,
  ],
  providers: [AppService],
})
export class AppModule {}
