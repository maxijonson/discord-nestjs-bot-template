import { Injectable } from "@nestjs/common";
import { EmbedBuilder, Events } from "discord.js";
import { Context, type ContextOf, On } from "necord";

@Injectable()
export class GuildMemberAddListener {
  @On(Events.GuildMemberAdd)
  async handleGuildMemberAdd(@Context() [member]: ContextOf<Events.GuildMemberAdd>) {
    const embed = new EmbedBuilder().setTitle("Welcome!").setDescription(`Hey ${member}!`);
    await member.guild.systemChannel?.send({ content: `👋 ${member}`, embeds: [embed] });
  }
}
