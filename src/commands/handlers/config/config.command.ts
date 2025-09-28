/**
 * Manages a simple key-value configuration store (the config doesn't actually do anything).
 * - `/config view` to view the current configuration. (Note: )
 * - `/config edit set <key> <value>` to set a configuration value.
 * - `/config edit delete <key>` to delete a configuration value.\
 * - `/config clear` to clear all configuration values.
 *
 * This command demonstrates how to create subcommands that:
 * - Have a subcommand (`/config view` and `/config clear`).
 * - Have a subcommand group (`/config edit set` and `/config edit delete`).
 *
 * IMPORTANT: When using subcommands, you lose the ability to have a "root" command (i.e. `/config` cannot exist when there's subcommands). This is a Discord limitation.
 */
import { applyDecorators, Injectable } from "@nestjs/common";
import { Context, createCommandGroupDecorator, Subcommand, type SlashCommandContext } from "necord";
import { InteractionError } from "src/common/errors/interaction-error";

// This will register the root of your command group (i.e. /config) and can be used for direct subcommands (i.e. /config clear)
export const ConfigCommandGroup = createCommandGroupDecorator({
  name: "config",
  description: "Does configuration stuff",
});

// This will register the subcommand group (i.e. /config edit) and can be used for subcommands within that group (i.e. /config edit set)
export const ConfigEditCommandGroup = () =>
  applyDecorators(
    ConfigCommandGroup({
      name: "edit",
      description: "Edit configuration values",
    }),
  );

@Injectable()
@ConfigCommandGroup()
export class ConfigCommand {
  // Normally, this would be some persistent storage like a database
  public store = new Map<string, string>();

  @Subcommand({
    name: "view",
    description: "View the current configuration",
  })
  async handleConfig(@Context() [interaction]: SlashCommandContext) {
    if (this.store.size === 0) {
      throw new InteractionError(
        `The configuration is empty. Set your first key using </config edit set:${interaction.commandId}>.`,
      );
    }

    const config = Array.from(this.store.entries()).reduce(
      (obj, [key, value]) => {
        obj[key] = value;
        return obj;
      },
      {} as Record<string, string>,
    );

    return interaction.reply({
      content: `Current configuration:\n\`\`\`json\n${JSON.stringify(config, null, 2)}\n\`\`\``,
    });
  }
}
