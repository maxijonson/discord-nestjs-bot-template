/**
 * Sets a key-value pair in the configuration store.
 *
 * This command demonstrates how to create a subcommand within a command group.
 */
import { Injectable } from "@nestjs/common";
import { ConfigEditCommandGroup, ConfigCommand } from "./config.command";
import { Context, Options, StringOption, Subcommand, type SlashCommandContext } from "necord";
import { InteractionError } from "src/common/errors/interaction-error";

class ConfigSetOptions {
  @StringOption({
    name: "key",
    description: "The configuration key to set",
    required: true,
    min_length: 1,
    max_length: 32,
  })
  key: string;

  @StringOption({
    name: "value",
    description: "The value to set for the configuration key",
    required: true,
    min_length: 1,
    max_length: 100,
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
    if (this.configCommand.store.size >= 100 && !this.configCommand.store.has(key)) {
      throw new InteractionError(
        "You have reached the maximum of 100 configuration entries. Please delete an entry before adding a new one.",
      );
    }
    this.configCommand.store.set(key, value);
    return interaction.reply({ content: `Configuration updated: \`${key}\` set to \`${value}\`.` });
  }
}
