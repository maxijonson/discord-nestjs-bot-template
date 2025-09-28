/**
 * Sets a key-value pair in the configuration store.
 *
 * This command demonstrates how to create a subcommand within a command group.
 */
import { Injectable } from "@nestjs/common";
import { ConfigEditCommandGroup, ConfigCommand } from "./config.command";
import { Context, Options, StringOption, Subcommand, type SlashCommandContext } from "necord";

class ConfigSetOptions {
  @StringOption({
    name: "key",
    description: "The configuration key to set",
    required: true,
  })
  key: string;

  @StringOption({
    name: "value",
    description: "The value to set for the configuration key",
    required: true,
  })
  value: string;
}

@Injectable()
@ConfigEditCommandGroup()
export class ConfigSetCommand {
  constructor(private readonly configCommand: ConfigCommand) {}

  @Subcommand({
    name: "set",
    description: "Set a configuration value",
  })
  async handleConfigSet(@Context() [interaction]: SlashCommandContext, @Options() { key, value }: ConfigSetOptions) {
    this.configCommand.store.set(key, value);
    return interaction.reply({ content: `Configuration updated: \`${key}\` set to \`${value}\`.` });
  }
}
