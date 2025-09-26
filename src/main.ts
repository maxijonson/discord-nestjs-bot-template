import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger } from "@nestjs/common";

async function bootstrap() {
  const _app = await NestFactory.create(AppModule);

  // Uncomment this line if you want your bot to also expose a REST API
  // await _app.listen(process.env.PORT ?? 3000);
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
