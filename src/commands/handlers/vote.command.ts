/**
 * A simple command that starts a Yes/No poll using buttons.
 *
 * This command demonstrates the use of buttons.
 */
import { Injectable } from "@nestjs/common";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } from "discord.js";
import {
  Button,
  type ButtonContext,
  Context,
  Options,
  SlashCommand,
  type SlashCommandContext,
  StringOption,
} from "necord";

class VoteOptions {
  @StringOption({
    name: "question",
    description: "The question to ask in the poll",
    required: true,
  })
  question: string;
}

@Injectable()
export class VoteCommand {
  @SlashCommand({
    name: "vote",
    description: "Start a simple Yes/No poll",
  })
  public async onVote(@Context() [interaction]: SlashCommandContext, @Options() { question }: VoteOptions) {
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().setCustomId("vote/yes").setLabel("👍 Yes").setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId("vote/no").setLabel("👎 No").setStyle(ButtonStyle.Danger),
    );

    await interaction.reply({
      content: question,
      components: [row],
    });
  }

  @Button("vote/yes")
  public async onYes(@Context() [interaction]: ButtonContext) {
    await interaction.reply({ content: "You voted **Yes** 👍", flags: MessageFlags.Ephemeral });
  }

  @Button("vote/no")
  public async onNo(@Context() [interaction]: ButtonContext) {
    await interaction.reply({ content: "You voted **No** 👎", flags: MessageFlags.Ephemeral });
  }
}
