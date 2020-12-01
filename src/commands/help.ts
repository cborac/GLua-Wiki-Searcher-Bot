import { Client, Message, MessageEmbed } from "discord.js";
import { Command } from "../Command";

export default class HelpCommand extends Command {
     helpMsg = "Komutlar için yardımı gösterir";
     variations = ["help", "yardim"];

     constructor(client: Client) {
          super(client)
     }

     eval(message: Message, args: string[]) {
          const commands = (this.client as any).commands;
          const distinctCommands = new Array();

          commands.forEach((command : Command) => {
               if (!distinctCommands.includes(command))
                    distinctCommands.push(command)
          });

          const commandsStr = distinctCommands.map((command : Command) => {
               const commandVariationsStr = "`"+command.variations.map((variation : string) => '?'+variation).join(', ')+"`";

               return commandVariationsStr + " - "+command.helpMsg;
          }).join('\n');

          message.channel.send(new MessageEmbed()
          .setColor(0x0082ff)
          .setAuthor(this.client.user.username, this.client.user.avatarURL())
          .addFields([{ name: "Komutlar", value: commandsStr }]))
     }
}