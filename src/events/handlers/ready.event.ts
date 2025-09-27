import { Injectable, Logger } from "@nestjs/common";
import { Once } from "necord";

@Injectable()
export class ReadyEvent {
  private logger = new Logger(ReadyEvent.name);

  @Once("clientReady")
  handleReady() {
    this.logger.log("Bot is online!");
  }
}
