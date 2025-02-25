import { CommandInteraction, EmbedBuilder } from "discord.js";
import moment from "moment";
import { Manager } from "../../manager.js";
import { Accessableby, Command } from "../../structures/Command.js";
import { CommandHandler } from "../../structures/CommandHandler.js";

export default class implements Command {
  public name = ["pm-profile"];
  public description = "View your premium profile!";
  public category = "Premium";
  public accessableby = Accessableby.Premium;
  public usage = "";
  public aliases = [];
  public lavalink = false;
  public usingInteraction = true;
  public playerCheck = false;
  public sameVoiceCheck = false;
  public permissions = [];

  public options = [];

  public async execute(client: Manager, handler: CommandHandler) {
    await handler.deferReply();

    const PremiumPlan = client.premiums.get(`${handler.user?.id}`);
    const expires = moment(PremiumPlan && PremiumPlan.expiresAt !== "lifetime" ? PremiumPlan.expiresAt : 0).format(
      "do/MMMM/YYYY (HH:mm:ss)"
    );

    const embed = new EmbedBuilder()
      .setAuthor({
        name: `${client.i18n.get(handler.language, "command.premium", "profile_author")}`,
        iconURL: client.user!.displayAvatarURL(),
      })
      .setDescription(
        `${client.i18n.get(handler.language, "command.premium", "profile_desc", {
          user: String(handler.user?.tag),
          plan: PremiumPlan!.plan,
          expires: PremiumPlan!.expiresAt == "lifetime" ? "lifetime" : expires,
        })}`
      )
      .setColor(client.color)
      .setTimestamp();

    return handler.editReply({ embeds: [embed] });
  }
}
