import { Injectable } from "@nestjs/common";
import { MessageFlags, PermissionFlagsBits } from "discord.js";
import { Context, NumberOption, Options, SlashCommand, type SlashCommandContext } from "necord";
import { InteractionError } from "src/common/errors/interaction-error";
import { RequiredBotPermission } from "src/common/guards/require-bot-permission.guard";

class PurgeOptions {
  @NumberOption({
    name: "amount",
    description: "Number of messages to delete (max 100)",
    required: true,
    min_value: 1,
    max_value: 100,
  })
  amount: number;
}

@Injectable()
export class PurgeCommand {
  @RequiredBotPermission(PermissionFlagsBits.ManageMessages)
  @SlashCommand({
    name: "purge",
    description: "Delete a number of messages from this channel",

    // This will make the command invisible to users without the Manage Messages permission
    defaultMemberPermissions: PermissionFlagsBits.ManageMessages,
  })
  async handlePurge(@Context() [interaction]: SlashCommandContext, @Options() { amount }: PurgeOptions) {
    const channel = interaction.channel;
    const guild = interaction.guild;

    if (!guild || !channel || !channel.isTextBased() || !("bulkDelete" in channel)) {
      throw new InteractionError("❌ This command can only be used in text channels.");
    }

    const deleted = await channel.bulkDelete(amount, true);

    return interaction.reply({
      content: `✅ Deleted **${deleted.size}** messages.`,
      flags: MessageFlags.Ephemeral,
    });
  }
}
