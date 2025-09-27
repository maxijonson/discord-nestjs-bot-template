import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger } from "@nestjs/common";
import { EnvService } from "./common/env/env.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const env = app.get(EnvService);

  await app.listen(env.get("PORT"));
}
bootstrap().catch((err) => {
  console.error("💥 Failed to bootstrap the application:", err);
});

// Prevent the bot from crashing when deep errors occur
const processLogger = new Logger("process");
process
  .on("unhandledRejection", (err) => {
    processLogger.error("💥 Unhandled Rejection:", err);
  })
  .on("uncaughtException", (err) => {
    processLogger.error("💥 Uncaught Exception:", err);
  });
