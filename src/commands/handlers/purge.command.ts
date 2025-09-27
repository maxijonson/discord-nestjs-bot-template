import { Injectable } from "@nestjs/common";
import { MessageFlags, PermissionFlagsBits } from "discord.js";
import { Context, NumberOption, Options, SlashCommand, type SlashCommandContext } from "necord";

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
  @SlashCommand({
    name: "purge",
    description: "Delete a number of messages from this channel",

    // This will make the command invisible to users without the Manage Messages permission
    defaultMemberPermissions: PermissionFlagsBits.ManageMessages,
  })
  async handlePurge(@Context() [interaction]: SlashCommandContext, @Options() { amount }: PurgeOptions) {
    const channel = interaction.channel;

    if (!channel || !channel.isTextBased() || !("bulkDelete" in channel)) {
      return interaction.reply({
        content: "❌ This command can only be used in text channels.",
        flags: MessageFlags.Ephemeral,
      });
    }

    const deleted = await channel.bulkDelete(amount, true);

    return interaction.reply({
      content: `✅ Deleted **${deleted.size}** messages.`,
      flags: MessageFlags.Ephemeral,
    });
  }
}
