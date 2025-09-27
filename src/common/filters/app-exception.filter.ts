import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { BaseInteraction, DiscordAPIError } from "discord.js";
import { InteractionError } from "../errors/interaction-error";

@Catch()
@Injectable()
export class AppExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AppExceptionFilter.name);

  private shouldLog(exception: any, host: ArgumentsHost): boolean {
    try {
      const type = host.getType<string>();
      let isInteraction = false;

      if (type === "necord") {
        const [context] = host.getArgs();
        if (!context) return true;

        const [interaction] = context;
        if (interaction instanceof BaseInteraction) {
          isInteraction = true;
        }
      }

      if (exception instanceof InteractionError && !isInteraction) {
        return true; // Log InteractionErrors outside of interaction contexts
      }

      if (exception instanceof DiscordAPIError) {
        // Don't log common Discord API errors that are out of our control anyway
        return !["50013", "50001", "10008"].includes(`${exception.code}`);
      }
    } catch {
      // If anything goes wrong, log the error
    }
    return true;
  }

  async catch(exception: any, host: ArgumentsHost) {
    const type = host.getType<string>();

    if (this.shouldLog(exception, host)) {
      this.logger.error(exception?.stack || exception?.message || String(exception));
    }

    // Handle Necord (Discord) execution contexts
    if (type === "necord") {
      const [context] = host.getArgs();
      if (!context) return;

      const [interaction] = context;
      if (interaction instanceof BaseInteraction) {
        await InteractionError.reply(interaction, exception, this.logger);
      }
      return;
    }

    // Handle HTTP contexts
    if (type === "http") {
      const ctx = host.switchToHttp();
      const res = ctx.getResponse();
      const status =
        typeof exception?.getStatus === "function" ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

      const body =
        typeof exception?.getResponse === "function"
          ? exception.getResponse()
          : { statusCode: status, message: exception?.message || String(exception) };

      return res.status(status).json(body);
    }
  }
}
