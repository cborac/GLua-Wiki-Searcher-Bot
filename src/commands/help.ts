import { Client, Message, MessageEmbed } from "discord.js";
import { Command } from "../Command";

export default class HelpCommand extends Command {
     constructor(client: Client) {
          super(client)
     }

     eval(message: Message, args: string[]) {
          message.channel.send(new MessageEmbed()
          .setColor(0x0082ff)
          .setAuthor(this.client.user.username, this.client.user.avatarURL())
          .addFields([{ name: "Komutlar", value: "`?search` - FacePunch Wikisinde bir şeyi arar.\n`?eval` - Verilen Lua kodunu executelar" }]))
     }
}