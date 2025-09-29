import { Injectable } from "@nestjs/common";
import { ActionRowBuilder, StringSelectMenuBuilder } from "discord.js";
import {
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
export class SelectStringCommand {
  private static readonly SELECT_ID = "select-string";

  @Subcommand({
    name: "string",
    description: "StringSelectMenu example",
  })
  async handleSelectString(@Context() [interaction]: SlashCommandContext) {
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId(SelectStringCommand.SELECT_ID)
      .setPlaceholder("Select a string")
      .addOptions(
        { label: "Option 1", value: "option_1", description: "This is option 1" },
        { label: "Option 2", value: "option_2", description: "This is option 2" },
        { label: "Option 3", value: "option_3", description: "This is option 3" },
        { label: "Option 4", value: "option_4", description: "This is option 4" },
        { label: "Option 5", value: "option_5", description: "This is option 5" },
      )
      .setMinValues(1)
      .setMaxValues(3);

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);

    return interaction.reply({
      content: "Select one or more strings from the menu below:",
      components: [row],
    });
  }

  // Component handlers don't need to be in the same class, it's just here for convenience.
  // If they get too big or you want to re-use them, consider moving them, perhaps in `src/components/handlers`.
  @StringSelect(SelectStringCommand.SELECT_ID)
  async handleSelectedStrings(@Context() [interaction]: StringSelectContext, @SelectedStrings() selected: string[]) {
    const selection = selected.map((s) => `- ${s}`).join("\n");

    return interaction.reply({
      content: `Your selection:\n${selection}`,
    });
  }
}
