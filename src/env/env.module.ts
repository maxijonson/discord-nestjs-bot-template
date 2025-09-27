import { Global, Module } from "@nestjs/common";
import { EnvService } from "./env.service";
import { ConfigModule } from "@nestjs/config";
import { Env } from "./env";
import z from "zod";

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => {
        const parsedEnv = Env.safeParse(env);
        if (parsedEnv.success === false) {
          throw new Error(`\n❌ Invalid environment variables:\n${z.prettifyError(parsedEnv.error)}\n`);
        }
        return parsedEnv.data;
      },
      isGlobal: true,
    }),
  ],
  providers: [EnvService],
  exports: [EnvService],
})
export class EnvModule {}
