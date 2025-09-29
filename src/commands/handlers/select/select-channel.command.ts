import { Injectable } from "@nestjs/common";
import { ActionRowBuilder, ChannelSelectMenuBuilder } from "discord.js";
import {
  Context,
  type ISelectedChannels,
  SelectedChannels,
  type SlashCommandContext,
  Subcommand,
  ChannelSelect,
  type ChannelSelectContext,
} from "necord";
import { SelectCommandGroup } from "./select.command";

@Injectable()
@SelectCommandGroup()
export class SelectChannelCommand {
  private static readonly SELECT_ID = "select-channel";

  @Subcommand({
    name: "channel",
    description: "ChannelSelectMenu example",
  })
  async handleSelectChannel(@Context() [interaction]: SlashCommandContext) {
    const selectMenu = new ChannelSelectMenuBuilder()
      .setCustomId(SelectChannelCommand.SELECT_ID)
      .setPlaceholder("Select a channel")
      .setMinValues(1)
      .setMaxValues(3);

    const row = new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(selectMenu);

    return interaction.reply({
      content: "Select one or more channels from the menu below:",
      components: [row],
    });
  }

  // Component handlers don't need to be in the same class, it's just here for convenience.
  // If they get too big or you want to re-use them, consider moving them, perhaps in `src/components/handlers`.
  @ChannelSelect(SelectChannelCommand.SELECT_ID)
  async handleSelectedChannels(
    @Context() [interaction]: ChannelSelectContext,
    @SelectedChannels() channels: ISelectedChannels,
  ) {
    const selection = channels.map((u) => `- <#${u.id}>`).join("\n");

    return interaction.reply({
      content: `Your selection:\n${selection}`,
    });
  }
}
