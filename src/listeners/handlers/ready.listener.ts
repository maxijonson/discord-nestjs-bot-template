import { Injectable, Logger } from "@nestjs/common";
import { Events } from "discord.js";
import { Once } from "necord";

@Injectable()
export class ReadyListener {
  private logger = new Logger(ReadyListener.name);

  @Once(Events.ClientReady)
  handleReady() {
    this.logger.log("Bot is online!");
  }
}
