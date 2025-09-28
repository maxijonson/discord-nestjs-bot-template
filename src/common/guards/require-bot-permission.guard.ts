import {
  applyDecorators,
  Injectable,
  SetMetadata,
  UseGuards,
  type CanActivate,
  type ExecutionContext,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { BaseInteraction, GuildChannel, PermissionFlagsBits, PermissionResolvable } from "discord.js";
import { NecordExecutionContext } from "necord";
import { InteractionError } from "../errors/interaction-error";

const REQUIRED_BOT_PERMISSIONS_KEY = "required_bot_permissions";

/**
 * Guard that ensures the bot has the required permissions to execute a command.
 * Use this over doing manual permission checks in each handler.
 */
@Injectable()
export class RequireBotPermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<PermissionResolvable[]>(REQUIRED_BOT_PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredPermissions) {
      return true;
    }

    const [interaction] = NecordExecutionContext.create(context).getContext();
    if (!interaction || !(interaction instanceof BaseInteraction) || !interaction.guild) return true;

    const channel = interaction.channel;
    if (!channel || !(channel instanceof GuildChannel)) return true;

    const botMember = interaction.guild.members.me;
    if (!botMember) return true;

    const permissions = channel.permissionsFor(botMember);
    if (!permissions || !permissions.has(requiredPermissions)) {
      let message = "❌ I don't have the required permissions to do that.";
      if (interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild)) {
        const missing = permissions
          ?.missing(requiredPermissions)
          .map((perm) => `\`${perm}\``)
          .join(", ");
        if (missing) {
          message += `\nMissing permissions: ${missing}`;
        }
      }
      throw new InteractionError(message);
    }

    return true;
  }
}

export const RequiredBotPermission = (...permissions: PermissionResolvable[]) =>
  applyDecorators(UseGuards(RequireBotPermissionGuard), SetMetadata(REQUIRED_BOT_PERMISSIONS_KEY, permissions));
