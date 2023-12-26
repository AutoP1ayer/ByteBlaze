import { EmbedBuilder, Message } from "discord.js";
import { Manager } from "../../../manager.js";
import { Accessableby, PrefixCommand } from "../../../@types/Command.js";
import { KazagumoPlayer } from "kazagumo.mod";
import { AutoReconnectBuilder } from "../../../database/build/AutoReconnect.js";

export default class implements PrefixCommand {
  name = "247";
  description = "24/7 in voice channel";
  category = "Music";
  usage = "<enable> or <disable>";
  aliases = [];
  accessableby = Accessableby.Member;
  lavalink = true;

  async run(
    client: Manager,
    message: Message,
    args: string[],
    language: string,
    prefix: string
  ) {
    const msg = await message.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription(
            `${client.i18n.get(language, "music", "247_loading")}`
          )
          .setColor(client.color),
      ],
    });

    const player = client.manager.players.get(message.guild!.id);

    const value = args[0];

    const data = await new AutoReconnectBuilder(client, player).execute(
      message.guild?.id!
    );

    if (value == "disable") {
      data.current || data.current.length !== 0
        ? await client.db.autoreconnect.set(
            `${message.guild!.id}.twentyfourseven`,
            false
          )
        : await client.db.autoreconnect.delete(`${message.guild!.id}`);

      player && player.voiceId && message.member!.voice.channel == null ? player.destroy() : true

      const on = new EmbedBuilder()
        .setDescription(`${client.i18n.get(language, "music", "247_off")}`)
        .setColor(client.color);
      msg.edit({ content: " ", embeds: [on] });

    } else if (value == "enable") {
      if (!player)
        return msg.edit({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `${client.i18n.get(language, "noplayer", "no_player")}`
              )
              .setColor(client.color),
          ],
        });


      const { channel } = message.member!.voice;
      if (
        !channel ||
        message.member!.voice.channel !== message.guild!.members.me!.voice.channel
      )
        return msg.edit({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `${client.i18n.get(language, "noplayer", "no_voice_247")}`
              )
              .setColor(client.color),
          ],
        });
    
      await client.db.autoreconnect.set(
        `${message.guild!.id}.twentyfourseven`,
        true
      );
      const on = new EmbedBuilder()
        .setDescription(`${client.i18n.get(language, "music", "247_on")}`)
        .setColor(client.color);
      return msg.edit({ content: " ", embeds: [on] });
    } else {
      const onsome = new EmbedBuilder()
        .setDescription(`${client.i18n.get(language, "music", "247_invalid")}`)
        .setColor(client.color);
      return msg.edit({ content: " ", embeds: [onsome] });
    }
  }
}
