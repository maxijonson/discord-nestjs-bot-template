/**
 * Replies with "Pong!"
 *
 * This is a basic example of a slash command handler using the @SlashCommand decorator from the necord library.
 */
import { Injectable } from "@nestjs/common";
import { Context, SlashCommand, type SlashCommandContext } from "necord";

@Injectable()
export class PingCommand {
  @SlashCommand({
    name: "ping",
    description: "Ping-Pong Command",
  })
  public async handlePing(@Context() [interaction]: SlashCommandContext) {
    return interaction.reply({ content: "Pong!" });
  }
}
