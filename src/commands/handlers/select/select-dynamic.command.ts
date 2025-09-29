import { Injectable } from "@nestjs/common";
import { ActionRowBuilder, StringSelectMenuBuilder } from "discord.js";
import {
  ComponentParam,
  Context,
  SelectedStrings,
  type SlashCommandContext,
  StringSelect,
  type StringSelectContext,
  Subcommand,
} from "necord";
import { SelectCommandGroup } from "./select.command";

@Injectable()
@SelectCommandGroup()
export class SelectDynamicCommand {
  private static readonly SELECT_ID = "select-dynamic/:item";

  @Subcommand({
    name: "dynamic",
    description: "Example with dynamic select menu",
  })
  async handleSelectDynamic(@Context() [interaction]: SlashCommandContext) {
    // Note: here we use a "string" select, but it can also be "user", "role", "channel" or "mentionable"
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId("select-dynamic/color") // Here, "color" will be passed as the "item" parameter
      .setPlaceholder("Select a color")
      .setMaxValues(1)
      .setMinValues(1)
      .setOptions([
        { label: "Red", value: "Red" },
        { label: "Blue", value: "Blue" },
        { label: "Yellow", value: "Yellow" },
      ]);

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);

    return interaction.reply({
      content: "Select one option below:",
      components: [row],
    });
  }

  @StringSelect(SelectDynamicCommand.SELECT_ID)
  public onPreferenceSelect(
    @Context() [interaction]: StringSelectContext,
    @SelectedStrings() values: string[],
    @ComponentParam("item") item: string,
  ) {
    return interaction.reply({
      content: `${item} = ${values.join(",")}`,
    });
  }
}
