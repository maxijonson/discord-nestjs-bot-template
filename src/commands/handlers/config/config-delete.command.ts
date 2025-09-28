/**
 * Deletes a key-value pair from the configuration store.
 *
 * This command demonstrates how to create a subcommand within a command group.
 */
import { Injectable } from "@nestjs/common";
import { ConfigEditCommandGroup, ConfigCommand } from "./config.command";
import { Context, Options, StringOption, Subcommand, type SlashCommandContext } from "necord";

class ConfigDeleteOptions {
  @StringOption({
    name: "key",
    description: "The configuration key to delete",
    required: true,
  })
  key: string;
}

@Injectable()
@ConfigEditCommandGroup()
export class ConfigDeleteCommand {
  constructor(private readonly configCommand: ConfigCommand) {}

  @Subcommand({
    name: "delete",
    description: "Delete a configuration value",
  })
  async handleConfigDelete(@Context() [interaction]: SlashCommandContext, @Options() { key }: ConfigDeleteOptions) {
    this.configCommand.store.delete(key);
    return interaction.reply({ content: `Configuration key \`${key}\` removed.` });
  }
}
