import { Injectable, Logger } from "@nestjs/common";
import { Once } from "necord";

@Injectable()
export class ReadyListener {
  private logger = new Logger(ReadyListener.name);

  @Once("clientReady")
  handleReady() {
    this.logger.log("Bot is online!");
  }
}
