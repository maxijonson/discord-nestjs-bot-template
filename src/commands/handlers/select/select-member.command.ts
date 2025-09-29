import { Injectable } from "@nestjs/common";
import { ActionRowBuilder, UserSelectMenuBuilder } from "discord.js";
import {
  Context,
  type ISelectedUsers,
  SelectedUsers,
  type SlashCommandContext,
  Subcommand,
  UserSelect,
  type UserSelectContext,
} from "necord";
import { SelectCommandGroup } from "./select.command";

@Injectable()
@SelectCommandGroup()
export class SelectMemberCommand {
  private static readonly SELECT_ID = "select-member";

  @Subcommand({
    name: "member",
    description: "UserSelectMenu example",
  })
  async handleSelectMember(@Context() [interaction]: SlashCommandContext) {
    const selectMenu = new UserSelectMenuBuilder()
      .setCustomId(SelectMemberCommand.SELECT_ID)
      .setPlaceholder("Select a user")
      .setMinValues(1)
      .setMaxValues(3);

    const row = new ActionRowBuilder<UserSelectMenuBuilder>().addComponents(selectMenu);

    return interaction.reply({
      content: "Select one or more users from the menu below:",
      components: [row],
    });
  }

  // Component handlers don't need to be in the same class, it's just here for convenience.
  // If they get too big or you want to re-use them, consider moving them, perhaps in `src/components/handlers`.
  @UserSelect(SelectMemberCommand.SELECT_ID)
  async handleSelectedMembers(
    @Context() [interaction]: UserSelectContext,
    @SelectedUsers() users: ISelectedUsers,
    // @SelectedMembers() members: ISelectedMembers,
  ) {
    const selection = users.map((u) => `- <@${u.id}>`).join("\n");

    return interaction.reply({
      content: `Your selection:\n${selection}`,
    });
  }
}
