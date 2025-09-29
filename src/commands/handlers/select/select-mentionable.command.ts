import { Injectable } from "@nestjs/common";
import { ActionRowBuilder, MentionableSelectMenuBuilder } from "discord.js";
import {
  Context,
  type SlashCommandContext,
  Subcommand,
  MentionableSelect,
  type MentionableSelectContext,
  type ISelectedMembers,
  type ISelectedRoles,
  type ISelectedUsers,
  SelectedMembers,
  SelectedRoles,
  SelectedUsers,
} from "necord";
import { SelectCommandGroup } from "./select.command";

@Injectable()
@SelectCommandGroup()
export class SelectMentionableCommand {
  private static readonly SELECT_ID = "select-mentionable";

  @Subcommand({
    name: "mentionable",
    description: "MentionableSelectMenu example",
  })
  async handleSelectMentionable(@Context() [interaction]: SlashCommandContext) {
    const selectMenu = new MentionableSelectMenuBuilder()
      .setCustomId(SelectMentionableCommand.SELECT_ID)
      .setPlaceholder("Select a mentionable")
      .setMinValues(1)
      .setMaxValues(3);

    const row = new ActionRowBuilder<MentionableSelectMenuBuilder>().addComponents(selectMenu);

    return interaction.reply({
      content: "Select one or more mentionables from the menu below:",
      components: [row],
    });
  }

  // Component handlers don't need to be in the same class, it's just here for convenience.
  // If they get too big or you want to re-use them, consider moving them, perhaps in `src/components/handlers`.
  @MentionableSelect(SelectMentionableCommand.SELECT_ID)
  async handleSelectedMentionables(
    @Context() [interaction]: MentionableSelectContext,
    @SelectedUsers() users: ISelectedUsers,
    @SelectedMembers() members: ISelectedMembers,
    @SelectedRoles() roles: ISelectedRoles,
  ) {
    return interaction.reply({
      content: [
        `Selected users - ${users.map((user) => user.username).join(",")}`,
        `Selected members - ${members.map((member) => member.user?.username).join(",")}`,
        `Selected roles - ${roles.map((role) => role.name).join(",")}`,
      ].join("\n"),
    });
  }
}
