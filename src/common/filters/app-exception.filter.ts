import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { DiscordAPIError, MessageFlags, type Interaction, BaseInteraction } from "discord.js";

const humanizeDiscordError = (err: unknown): string => {
  let message = "Something went wrong while executing this action.";

  if (err instanceof DiscordAPIError) {
    switch (err.code) {
      case 50013: // Missing Permissions
        message = "I don't have the required permissions to perform that action.";
        break;
      case 50001: // Missing Access
        message = "I don't have access to that something.";
        break;
      case 10008: // Unknown Message (often deleted)
        message = "That message no longer exists.";
        break;
    }
  }

  return message;
};

const safeInteractionReply = async (interaction: Interaction, content: string) => {
  try {
    if (interaction.isRepliable()) {
      await interaction.reply({ content, flags: MessageFlags.Ephemeral });
    }
  } catch {
    // Swallow reply errors – we don't want error loops
  }
};

@Catch()
@Injectable()
export class AppExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AppExceptionFilter.name);

  async catch(exception: any, host: ArgumentsHost) {
    const type = host.getType<string>();

    // Log once, with as much useful info as possible
    this.logger.error(exception?.stack || exception?.message || String(exception));

    // Handle Necord (Discord) execution contexts
    if (type === "necord") {
      const [context] = host.getArgs();
      if (!context) return;

      const [interaction] = context;
      if (interaction instanceof BaseInteraction && interaction.isRepliable()) {
        const friendly = humanizeDiscordError(exception);
        await safeInteractionReply(interaction, friendly);
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
          : { statusCode: status, message: humanizeDiscordError(exception) };

      return res.status(status).json(body);
    }
  }
}
