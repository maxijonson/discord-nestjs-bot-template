/**
 * Creates a poll with a question, choices, and duration.
 * Note that Discord has a built-in poll feature. While you would typically use theirs, this is just an example.
 *
 * This command demonstrates an advanced use of buttons, collectors and timed interactions.
 */
import { Injectable } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  MessageFlags,
  PermissionFlagsBits,
} from "discord.js";
import ms, { type StringValue } from "ms";
import {
  Button,
  type ButtonContext,
  ComponentParam,
  Context,
  Options,
  SlashCommand,
  type SlashCommandContext,
  StringOption,
} from "necord";
import { DAY, SECOND } from "src/common/constants/time.constants";
import { InteractionError } from "src/common/errors/interaction-error";
import { RequiredMemberPermission } from "src/common/guards/require-member-permission.guard";

class PollOptions {
  @StringOption({
    name: "question",
    description: "The question to ask in the poll",
    required: true,
  })
  question: string;

  @StringOption({
    name: "choice1",
    description: "1st choice",
    required: true,
  })
  choice1: string;

  @StringOption({
    name: "choice2",
    description: "2nd choice",
    required: true,
  })
  choice2: string;

  @StringOption({
    name: "choice3",
    description: "3rd choice",
    required: false,
  })
  choice3?: string;

  @StringOption({
    name: "choice4",
    description: "4th choice",
    required: false,
  })
  choice4?: string;

  @StringOption({
    name: "choice5",
    description: "5th choice",
    required: false,
  })
  choice5?: string;

  @StringOption({
    name: "duration",
    description: "Duration of the poll, (e.g., 10m, 1h, 1d). Defaults to 1m",
    required: false,
  })
  duration?: string;
}

interface Poll {
  id: string;
  question: string;
  choices: string[];
  endTime: number;
  votes: Vote[];
}

interface Vote {
  userId: string;
  choiceIndex: number;
}

@Injectable()
export class PollCommand {
  private polls: Map<string, Poll> = new Map();

  constructor(private readonly schedulerRegistry: SchedulerRegistry) {}

  @RequiredMemberPermission(PermissionFlagsBits.ManageMessages)
  @SlashCommand({
    name: "poll",
    description: "Create a poll with a question, choices, and duration.",
  })
  async handlePoll(
    @Context() [interaction]: SlashCommandContext,
    @Options() { question, choice1, choice2, choice3, choice4, choice5, duration }: PollOptions,
  ) {
    duration ||= "1m";
    const durationMs = (() => {
      try {
        return ms(duration as StringValue);
      } catch (e) {
        console.error(`Failed to parse duration (${duration}):`, e);
        return null;
      }
    })();
    if (!durationMs) {
      throw new InteractionError("❌ Invalid duration format. Use formats like '10m', '1h', '1d'.");
    }
    if (durationMs < 10 * SECOND || durationMs > 7 * DAY) {
      throw new InteractionError("❌ Duration must be between 10 seconds and 7 days.");
    }
    const choices = [choice1, choice2, choice3, choice4, choice5].filter((c): c is string => !!c);
    const pollId = interaction.id;

    const buttons = choices.map((choice, choiceIndex) =>
      new ButtonBuilder().setCustomId(`poll/${pollId}/${choiceIndex}`).setLabel(choice).setStyle(ButtonStyle.Primary),
    );
    const buttonsRow = new ActionRowBuilder<ButtonBuilder>().addComponents(buttons);

    const poll: Poll = {
      id: pollId,
      question,
      choices,
      endTime: Date.now() + durationMs,
      votes: [],
    };
    this.polls.set(pollId, poll);

    const embed = new EmbedBuilder()
      .setTitle("📊 " + question)
      .setDescription(this.getPollDescription(poll))
      .setFooter({ text: `Poll ends in ${ms(durationMs, { long: true })}` });

    await interaction.reply({
      embeds: [embed],
      components: [buttonsRow],
      withResponse: true,
    });

    this.schedulerRegistry.addTimeout(
      `poll/${pollId}`,
      setTimeout(async () => {
        const endedPoll = this.polls.get(pollId);
        if (!endedPoll) return;

        const message = await interaction.fetchReply();
        const [currentEmbed] = message.embeds;
        const endedEmbed = EmbedBuilder.from(currentEmbed)
          .setDescription(this.getPollDescription(endedPoll, true))
          .setFooter({ text: "This poll has ended." });

        await message.edit({ embeds: [endedEmbed], components: [] });
        this.polls.delete(pollId);
      }, durationMs),
    );
  }

  @Button("poll/:pollId/:choiceIndex")
  async handlePollVote(
    @Context() [interaction]: ButtonContext,
    @ComponentParam("pollId") pollId: string,
    @ComponentParam("choiceIndex") _choiceIndex: string,
  ) {
    const choiceIndex = parseInt(_choiceIndex, 10);
    if (isNaN(choiceIndex)) {
      throw new InteractionError("❌ Invalid choice index.");
    }
    const poll = this.polls.get(pollId);
    if (!poll) {
      throw new InteractionError("❌ Poll not found.");
    }
    if (poll.endTime < Date.now()) {
      throw new InteractionError("❌ Poll is closed.");
    }

    const choice = poll.choices[choiceIndex];
    if (!choice) {
      throw new InteractionError("❌ Invalid choice.");
    }

    const existingVote = poll.votes.find((v) => v.userId === interaction.user.id);
    if (existingVote) {
      existingVote.choiceIndex = choiceIndex;
    } else {
      poll.votes.push({ userId: interaction.user.id, choiceIndex });
    }

    const [embed] = interaction.message.embeds;
    const updatedEmbed = EmbedBuilder.from(embed).setDescription(this.getPollDescription(poll));
    await interaction.message.edit({
      embeds: [updatedEmbed],
    });

    await interaction.reply({ content: `You voted for ${choice}.`, flags: MessageFlags.Ephemeral });
  }

  private getPollDescription(poll: Poll, showWinner = false): string {
    const [winners] = poll.choices.reduce<[string[], number]>(
      ([acc, maxVotes], choice, index) => {
        const voteCount = poll.votes.filter((v) => v.choiceIndex === index).length;
        if (voteCount > maxVotes) return [[choice], voteCount];
        if (voteCount === maxVotes) acc.push(choice);
        return [acc, maxVotes];
      },
      [[], 0],
    );
    const winnerIcon = winners.length > 1 ? " ⚖️" : " 🏆";

    return poll.choices
      .map((c, i) => {
        const voteCount = poll.votes.filter((v) => v.choiceIndex === i).length;
        const isWinner = showWinner && winners.includes(c);
        const winnerSuffix = isWinner ? winnerIcon : "";
        return `**${i + 1}**. ${c} (${voteCount} vote${voteCount !== 1 ? "s" : ""})${winnerSuffix}`;
      })
      .join("\n");
  }
}
