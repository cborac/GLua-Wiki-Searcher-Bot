import { Client, Message, MessageEmbed } from "discord.js";
import { Command } from "../Command";
import fetch from "node-fetch";
import { JSDOM } from "jsdom";
import { URLSearchParams } from "url";

export default class EvalCommand extends Command {
     helpMsg = "Verilen Lua kodunu executelar";
     variations = ["eval", "runlua", "lua", "luaoynat", "print"];

     constructor(client: Client) {
          super(client)
     }

     async eval(message: Message, args: string[]) {
          let luaContent = message.content.substring(message.content.indexOf(' '))
          luaContent = luaContent.replace('```lua', '').replace(/`/gm, '').trim()

          if (args.length === 1) {
               message.reply(new MessageEmbed({
                    color: 0xe54c3c,
                    fields: [{
                         name: "Hata",
                         value: "```diff\nLua boş olamaz!\n```"
                    }]
               }))
               return
          }

          const body = new URLSearchParams()

          body.append("input", luaContent)
          const { window } = await fetch(`https://www.lua.org/cgi-bin/demo`, {
               method: "POST",
               body
          }).then(async x => new JSDOM(await x.text()))

          const res = window.document.querySelector("body > textarea").textContent.trim()

          const failed = (window.document.querySelector("body > p:nth-child(8) > img") as HTMLImageElement).src === "https://www.lua.org/images/alert.png"

          message.reply(new MessageEmbed({
               color: failed ? 0xe54c3c : 0x0082ff,
               fields: [{
                    name: "Giriş",
                    value: "```lua\n" + luaContent + "\n```"
               },
               {
                    name: "Çıkış",
                    value: "```diff\n" + (failed ? "- " : "") + res.split("\n").join(`\n${failed ? "- " : ""}`) + "```"
               }]
          }))
     }
}