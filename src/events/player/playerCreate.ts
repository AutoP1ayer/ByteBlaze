import { KazagumoPlayer } from "../../lib/main.js";
import { Manager } from "../../manager.js";

export default class {
  async execute(client: Manager, player: KazagumoPlayer) {
    const guild = await client.guilds.fetch(player.guildId);
    client.logger.info(import.meta.url, `Player Created in @ ${guild!.name} / ${player.guildId}`);
    client.emit("playerCreate", player.guildId);
  }
}
