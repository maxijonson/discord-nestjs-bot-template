import { Logger } from "@nestjs/common";
import { DiscordAPIError, MessageFlags, type BaseInteraction } from "discord.js";

/**
 * Custom error class that can be used when you expect the error to be shown to the user.
 *
 * Only use this where an interaction is involved (slash commands, buttons, etc). Using this in non-interaction
 * contexts (like event handlers) will not show the message to the user.
 */
export class InteractionError extends Error {
  private static readonly logger = new Logger(InteractionError.name);

  constructor(
    public readonly userMessage: string,
    public readonly internalMessage?: string,
  ) {
    super(internalMessage || userMessage);
    this.name = "InteractionError";
  }

  public static fromError(err: unknown) {
    if (err instanceof InteractionError) return err;
    let message = "Something went wrong.";

    if (err instanceof DiscordAPIError) {
      switch (`${err.code}`) {
        case "50013": // Missing Permissions
          message = "I don't have the required permissions to perform that action.";
          break;
        case "50001": // Missing Access
          message = "I don't have access to that something.";
          break;
        case "10008": // Unknown Message (often deleted)
          message = "That message no longer exists.";
          break;
      }
    }

    if (err instanceof Error) {
      return new InteractionError(message, err.message);
    }
    return new InteractionError(message, String(err));
  }

  public static async reply(interaction: BaseInteraction, err: unknown, logger = InteractionError.logger) {
    const interactionError = InteractionError.fromError(err);
    if (interaction.isRepliable()) {
      try {
        if (interaction.deferred || interaction.replied) {
          await interaction.editReply({ content: interactionError.userMessage });
          return;
        }
        await interaction.reply({ content: interactionError.userMessage, flags: MessageFlags.Ephemeral });
      } catch (e) {
        logger.error("Failed to reply to interaction", e);
      }
    } else {
      logger.warn("Interaction is not repliable, cannot send error message to user:", interactionError.userMessage);
      logger.error(
        interactionError.internalMessage ||
          interactionError.stack ||
          interactionError.message ||
          String(interactionError),
      );
    }
  }
}
