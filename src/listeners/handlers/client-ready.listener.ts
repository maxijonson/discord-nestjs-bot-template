import { Injectable, Logger } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import { ActivityType, Client, Events } from "discord.js";
import { Context, Once } from "necord";

@Injectable()
export class ClientReadyListener {
  private readonly logger = new Logger(ClientReadyListener.name);

  constructor(private readonly schedulerRegistry: SchedulerRegistry) {}

  @Once(Events.ClientReady)
  onClientReady(@Context() [client]: [Client]) {
    this.logger.log(`Logged in as ${client.user?.tag} on ${client.guilds.cache.size} guilds`);
    const statuses = [
      () => ({ name: `${client.guilds.cache.size} servers`, type: ActivityType.Watching }),
      () => ({ name: `📶 ${Math.round(client.ws.ping)}ms`, type: ActivityType.Custom }),
    ];

    let i = 0;
    this.schedulerRegistry.addInterval(
      "status",
      setInterval(() => client.user?.setPresence({ activities: [statuses[i++ % statuses.length]()] }), 15_000),
    );
  }
}
