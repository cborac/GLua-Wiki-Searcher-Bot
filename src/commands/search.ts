import { Client, Message, MessageEmbed } from "discord.js";
import { Command } from "../Command";
import { JSDOM } from "jsdom"
import fetch from "node-fetch";
import AsciiTable = require("table")
import { link } from 'fs';
import Fuse from "fuse.js";

const root = "https://wiki.facepunch.com"
const base = root + "/gmod"

const author = {
     url: base,
     iconURL: "https://files.facepunch.com/garry/822e60dc-c931-43e4-800f-cbe010b3d4cc.png",
     name: "Garry's Mod Wiki"
}

function testArray(inital: string[]): string[][] {
     if (inital.join("\n\n").length < 1024) return [inital]

     const temp = []
     for (let i = 0; temp.flat().length < inital.length;) {
          const part = inital.slice(0, i)

          if (part.join("\n\n").length > 1024) temp.push(inital.slice(0, i - 1))
          else i++
     }
     return temp
}

const fuseOptions = {
     includeScore: true,
     keys: [
          "search",
   ]
};

export default class SearchCommand extends Command {
     helpMsg = "FacePunch Wikisinde bir şeyi arar.";
     variations = ["search", "ara", "wikiara"];
     searchList : Object[] = [];
     fuse: any;

     constructor(client: Client) {
          super(client);
          this.prepareSearchSet();
     }

     async prepareSearchSet()
     {
          if (this.searchList.length==0){               
               let res = await fetch(`${base}`);
               
               const { window } = new JSDOM(await res.text());
               const links = window.document.querySelector("#contents > div:nth-child(6)").querySelectorAll("a");
               for (let i=0; i<links.length; i++){
                    this.searchList.push({
                         href: links[i].getAttribute("href"),
                         search: links[i].getAttribute("search")
                    })
               }
               
               this.fuse = new Fuse(this.searchList, fuseOptions);
          }
     }

     async eval(message: Message, args: string[]) {
          if (!args[1]) return;

          let searchResults = this.fuse.search(args[1]);

          if (searchResults.length == 0)
          {
               // TODO: Error message 'could not find anything related to your search'
               return;
          }

          if (searchResults.length>1 && searchResults[1].score - searchResults[0].score > 0.01)
          {
               searchResults = searchResults.slice(0,1);
          }
          else
          {
               let searchResultsSameScore = searchResults.filter((result : any) => (result.score <= searchResults[0].score));
               searchResults = searchResults.slice(0, Math.min(10, Math.max(5, searchResultsSameScore.length)))
          }

          if (searchResults.length > 1)
          {
               const resultsLinks = searchResults.map((result : any) => `**[${result.item.search}](${base}${result.item.href})**`)
               message.channel.send(new MessageEmbed({
                    color: 0x0082ff,
                    description: "**Aradığınız şeye dair bir çok şey buldum, bir tanesini tekrar aratabilirsiniz:**\n\n" + resultsLinks.join("\n"), // TODO: maybe do the reaction thing?
                    author
               })) 
          }
          else 
          {
               // target page = root + searchResults[0].item.href + "?format=json"
               // TODO: Implement message thing for the target page
          }
     }
}