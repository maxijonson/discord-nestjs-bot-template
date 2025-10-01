/**
 * Collects anonymous feedback from users via a modal form.
 *
 * This command demonstrates the use of modals.
 */
import { Injectable, Logger } from "@nestjs/common";
import { ActionRowBuilder, MessageFlags, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { Context, Modal, ModalParam, SlashCommand, type ModalContext, type SlashCommandContext } from "necord";

@Injectable()
export class FeedbackCommand {
  private logger = new Logger(FeedbackCommand.name);

  @SlashCommand({
    name: "feedback",
    description: "Send anonymous feedback to the bot owner",
  })
  async onFeedback(@Context() [interaction]: SlashCommandContext) {
    const modal = new ModalBuilder()
      .setCustomId(`feedback-modal/${interaction.user.id}`) // Just like select menus, modals can have dynamic custom IDs
      .setTitle("Feedback Form");

    // Only TextInputs are supported by Discord right now
    const subjectInput = new TextInputBuilder()
      .setCustomId("feedback-subject")
      .setLabel("Subject")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const messageInput = new TextInputBuilder()
      .setCustomId("feedback-message")
      .setLabel("Your feedback")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    modal.addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(subjectInput),
      new ActionRowBuilder<TextInputBuilder>().addComponents(messageInput),
    );

    await interaction.showModal(modal);
  }

  @Modal(`feedback-modal/:userId`)
  async onFeedbackModal(@Context() [interaction]: ModalContext, @ModalParam("userId") userId: string) {
    const subject = interaction.fields.getTextInputValue("feedback-subject");
    const message = interaction.fields.getTextInputValue("feedback-message");
    const member = await interaction.guild?.members.fetch(userId);

    this.logger.log(`New feedback received from ${member?.displayName}:\nSubject: ${subject}\nMessage: ${message}`);

    await interaction.reply({
      content: "Thank you for your feedback!",
      flags: MessageFlags.Ephemeral,
    });
  }
}
