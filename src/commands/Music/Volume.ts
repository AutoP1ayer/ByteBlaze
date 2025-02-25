import { ApplicationCommandOptionType, EmbedBuilder, Message } from "discord.js";
import { Manager } from "../../manager.js";
import { KazagumoPlayer } from "../../lib/main.js";
import { AutoReconnectBuilderService } from "../../services/AutoReconnectBuilderService.js";
import { Accessableby, Command } from "../../structures/Command.js";
import { CommandHandler } from "../../structures/CommandHandler.js";

// Main code
export default class implements Command {
  public name = ["volume"];
  public description = "Adjusts the volume of the bot.";
  public category = "Music";
  public accessableby = Accessableby.Member;
  public usage = "<number>";
  public aliases = ["vol"];
  public lavalink = true;
  public playerCheck = true;
  public usingInteraction = true;
  public sameVoiceCheck = true;
  public permissions = [];
  public options = [
    {
      name: "amount",
      description: "The amount of volume to set the bot to.",
      type: ApplicationCommandOptionType.Number,
      required: true,
    },
  ];

  public async execute(client: Manager, handler: CommandHandler) {
    await handler.deferReply();

    const value = handler.args[0];
    if (value && isNaN(+value))
      return handler.editReply({
        embeds: [
          new EmbedBuilder()
            .setDescription(`${client.i18n.get(handler.language, "command.music", "number_invalid")}`)
            .setColor(client.color),
        ],
      });

    const player = client.manager.players.get(handler.guild!.id) as KazagumoPlayer;

    if (!value)
      return handler.editReply({
        embeds: [
          new EmbedBuilder()
            .setDescription(`${client.i18n.get(handler.language, "command.music", "number_invalid")}`)
            .setColor(client.color),
        ],
      });
    if (Number(value) <= 0 || Number(value) > 100)
      return handler.editReply({
        embeds: [
          new EmbedBuilder()
            .setDescription(`${client.i18n.get(handler.language, "command.music", "volume_invalid")}`)
            .setColor(client.color),
        ],
      });

    await player.setVolume(Number(value));

    const changevol = new EmbedBuilder()
      .setDescription(
        `${client.i18n.get(handler.language, "command.music", "volume_msg", {
          volume: value,
        })}`
      )
      .setColor(client.color);

    handler.editReply({ content: " ", embeds: [changevol] });
  }
}
