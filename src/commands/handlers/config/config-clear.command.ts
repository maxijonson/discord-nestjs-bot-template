import { Injectable } from "@nestjs/common";
import { Context, type SlashCommandContext, Subcommand } from "necord";
import { ConfigCommand, ConfigCommandGroup } from "./config.command";

@Injectable()
@ConfigCommandGroup()
export class ConfigClearCommand {
  constructor(private readonly configCommand: ConfigCommand) {}

  @Subcommand({
    name: "clear",
    description: "Clear all configuration values",
  })
  async handleConfigClear(@Context() [interaction]: SlashCommandContext) {
    this.configCommand.store.clear();
    return interaction.reply({ content: "All configuration values have been cleared." });
  }
}
