import { Injectable } from "@nestjs/common";
import { ActionRowBuilder, RoleSelectMenuBuilder } from "discord.js";
import {
  Context,
  type ISelectedRoles,
  SelectedRoles,
  type SlashCommandContext,
  Subcommand,
  RoleSelect,
  type RoleSelectContext,
} from "necord";
import { SelectCommandGroup } from "./select.command";

@Injectable()
@SelectCommandGroup()
export class SelectRoleCommand {
  private static readonly SELECT_ID = "select-role";

  @Subcommand({
    name: "role",
    description: "RoleSelectMenu example",
  })
  async handleSelectRole(@Context() [interaction]: SlashCommandContext) {
    const selectMenu = new RoleSelectMenuBuilder()
      .setCustomId(SelectRoleCommand.SELECT_ID)
      .setPlaceholder("Select a role")
      .setMinValues(1)
      .setMaxValues(3);

    const row = new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(selectMenu);

    return interaction.reply({
      content: "Select one or more roles from the menu below:",
      components: [row],
    });
  }

  // Component handlers don't need to be in the same class, it's just here for convenience.
  // If they get too big or you want to re-use them, consider moving them, perhaps in `src/components/handlers`.
  @RoleSelect(SelectRoleCommand.SELECT_ID)
  async handleSelectedRoles(@Context() [interaction]: RoleSelectContext, @SelectedRoles() roles: ISelectedRoles) {
    const selection = roles.map((u) => `- <@&${u.id}>`).join("\n");

    return interaction.reply({
      content: `Your selection:\n${selection}`,
    });
  }
}
