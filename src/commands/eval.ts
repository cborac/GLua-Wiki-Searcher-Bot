import { Client, Message, MessageEmbed } from "discord.js";
import { Command } from "../Command";
import fetch from "node-fetch";
import { JSDOM } from "jsdom";
import { URLSearchParams } from "url";

export default class EvalCommand extends Command {
     helpMsg = "Verilen Lua kodunu executelar";
     variations = ["eval", "runlua", "lua", "luaoynat"];

     constructor(client: Client) {
          super(client)
     }

     async eval(message: Message, args: string[]) {
          const lines = message.content.split("\n");

          const body = new URLSearchParams()

          body.append("input", lines.slice(1, lines.length - 1).join("\n"))

          const { window } = await fetch(`https://www.lua.org/cgi-bin/demo`, {
               method: "POST",
               body
          }).then(async x => new JSDOM(await x.text()))

          const res = window.document.querySelector("body > textarea").textContent.trim()

          const failed = (window.document.querySelector("body > p:nth-child(8) > img") as HTMLImageElement).src === "https://www.lua.org/images/alert.png"

          message.channel.send(new MessageEmbed({
               color: failed ? 0xe54c3c : 0x0082ff,
               fields: [{
                    name: "Giriş",
                    value: "```lua\n" + lines.slice(1, lines.length - 1).join("\n") + "\n```"
               },
               {
                    name: "Çıkış",
                    value: "```diff\n" + (failed ? "- " : "") + res.split("\n").join(`\n${failed ? "- " : ""}`) + "```"
               }]
          }))
     }
}