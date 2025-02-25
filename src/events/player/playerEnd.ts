import { KazagumoPlayer } from "../../lib/main.js";
import { Manager } from "../../manager.js";
import { TextChannel } from "discord.js";
import { ClearMessageService } from "../../services/ClearMessageService.js";
import { AutoReconnectBuilderService } from "../../services/AutoReconnectBuilderService.js";

export default class {
  async execute(client: Manager, player: KazagumoPlayer) {
    if (!client.isDatabaseConnected)
      return client.logger.warn(
        import.meta.url,
        "The database is not yet connected so this event will temporarily not execute. Please try again later!"
      );

    const guild = await client.guilds.fetch(player.guildId);
    client.logger.info(import.meta.url, `Player End in @ ${guild!.name} / ${player.guildId}`);

    /////////// Update Music Setup //////////
    await client.UpdateMusic(player);
    /////////// Update Music Setup ///////////

    client.emit("playerEnd", player);

    let data = await new AutoReconnectBuilderService(client, player).get(player.guildId);
    const channel = (await client.channels.fetch(player.textId)) as TextChannel;
    if (!channel) return;

    if (data && data.twentyfourseven) return;

    if (player.queue.length || player!.queue!.current) return new ClearMessageService(client, channel, player);

    if (player.loop !== "none") return new ClearMessageService(client, channel, player);

    const currentPlayer = (await client.manager.getPlayer(player.guildId)) as KazagumoPlayer;
    if (!currentPlayer) return;
    if (currentPlayer.voiceId !== null) {
      await player.destroy();
    }
  }
}
