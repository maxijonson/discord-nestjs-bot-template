/**
 * Echoes back the provided text, optionally in uppercase if 'loud' is true.
 *
 * This command demonstrates the use of primitive options in a slash command.
 */
import { Injectable } from "@nestjs/common";
import { BooleanOption, Context, Options, SlashCommand, StringOption, type SlashCommandContext } from "necord";

class EchoOptions {
  @StringOption({
    name: "text",
    description: "Text to echo back",
    required: true,
    min_length: 1,
    max_length: 200,
  })
  text: string;

  @BooleanOption({
    name: "loud",
    description: "Whether to scream back the text",
    required: false,
  })
  loud?: boolean;
}

@Injectable()
export class EchoCommand {
  @SlashCommand({
    name: "echo",
    description: "Back at you!",
  })
  async handleEcho(@Context() [interaction]: SlashCommandContext, @Options() { text, loud }: EchoOptions) {
    text = loud ? text.toUpperCase() : text;
    await interaction.reply(`Echo: ${text}${loud ? "!!!" : "."}`);
  }
}
