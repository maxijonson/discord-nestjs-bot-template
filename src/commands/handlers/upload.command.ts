import { Injectable } from "@nestjs/common";
import { EmbedBuilder, type Attachment } from "discord.js";
import { AttachmentOption, Context, Options, SlashCommand, type SlashCommandContext } from "necord";

class UploadOptions {
  @AttachmentOption({
    name: "image",
    description: "The image to upload",
    required: true,
  })
  image: Attachment;
}

@Injectable()
export class UploadCommand {
  @SlashCommand({
    name: "upload",
    description: "Runs the 'upload' command",
  })
  async handleUpload(@Context() [interaction]: SlashCommandContext, @Options() { image }: UploadOptions) {
    if (!image.contentType?.startsWith("image/")) {
      return interaction.reply({ content: "Please upload a valid image file.", ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setTitle("Uploaded Image")
      .setImage(image.url)
      .setFooter({ text: `Uploaded by ${interaction.user.tag}` })
      .setTimestamp()
      .addFields(
        { name: "File Name", value: image.name ?? "Unknown", inline: true },
        { name: "File Size", value: `${(image.size / 1024).toFixed(2)} KB`, inline: true },
        { name: "File Type", value: image.contentType ?? "Unknown", inline: true },
        { name: "Dimensions", value: `${image.width}x${image.height}`, inline: true },
      );

    return interaction.reply({ embeds: [embed] });
  }
}
