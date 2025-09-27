import { Injectable } from "@nestjs/common";
import { EmbedBuilder, GuildMember, Role, User } from "discord.js";
import { Context, MentionableOption, Options, SlashCommand, type SlashCommandContext } from "necord";

class WhatisOptions {
  @MentionableOption({
    name: "thing",
    description: "The thing to get info about",
    required: true,
    name_localizations: {
      fr: "chose",
    },
  })
  thing?: GuildMember | Role | User;
}

@Injectable()
export class WhatisCommand {
  @SlashCommand({
    name: "whatis",
    description: "Example command",
  })
  async handleWhatis(@Context() [interaction]: SlashCommandContext, @Options() { thing }: WhatisOptions) {
    const embed = new EmbedBuilder();
    if (thing instanceof GuildMember) {
      embed
        .setTitle(`Member: ${thing.user.tag}`)
        .setThumbnail(thing.user.displayAvatarURL())
        .addFields(
          { name: "ID", value: thing.id, inline: true },
          { name: "Nickname", value: thing.nickname ?? "None", inline: true },
          { name: "Joined At", value: thing.joinedAt?.toDateString() ?? "Unknown", inline: true },
          {
            name: "Roles",
            value: thing.roles.cache.map((r) => r.name).join(", ") || "None",
          },
        );
    } else if (thing instanceof Role) {
      embed
        .setTitle(`Role: ${thing.name}`)
        .addFields(
          { name: "ID", value: thing.id, inline: true },
          { name: "Color", value: thing.hexColor, inline: true },
          { name: "Members", value: `${thing.members.size}`, inline: true },
          { name: "Mentionable", value: thing.mentionable ? "Yes" : "No", inline: true },
        )
        .setColor(thing.color);
    } else if (thing instanceof User) {
      embed
        .setTitle(`User: ${thing.tag}`)
        .setThumbnail(thing.displayAvatarURL())
        .addFields(
          { name: "ID", value: thing.id, inline: true },
          { name: "Bot", value: thing.bot ? "Yes" : "No", inline: true },
          { name: "Created At", value: thing.createdAt.toDateString(), inline: true },
        );
    } else {
      embed.setDescription("Unknown mentionable type.");
    }
    await interaction.reply({ embeds: [embed] });
  }
}
