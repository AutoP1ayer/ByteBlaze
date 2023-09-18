import { Manager } from "../../manager.js";
const regex =
  /^(wss?|ws?:\/\/)([0-9]{1,3}(?:\.[0-9]{1,3}){3}|[^\/]+):([0-9]{1,5})$/;
  
 const regex_no_port =
  /^(wss?|ws?:\/\/)([0-9]{1,3}(?:\.[0-9]{1,3}){3}|[^\/]+)/;

export default async (client: Manager, name: string) => {
  if (client.used_lavalink.length != 0 && client.used_lavalink[0].name == name)
    return;
  client.fixing_nodes = false;

  client.manager.shoukaku.nodes.forEach((data, index) => {
	let res
    res = regex.exec(data["url"]);
	if (res == null) {
		res = regex_no_port.exec(data["url"])
	}
    client.lavalink_using.push({
      host: res![2],
      port: Number(res![3]) | 0,
      pass: data["auth"],
      secure: res![1] == "ws://" ? false : true,
      name: index,
    });
  });

  client.logger.info(`Lavalink [${name}] connected.`);
};
