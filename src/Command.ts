import { Client, Message } from "discord.js";

export abstract class Command {
     client: Client;
     variations: string[];
     helpMsg: string;
     // TODO: Add usageMsg property which shows an example on how this command is used, implement it in help.ts

     constructor(client: Client) {
          this.client = client
     }

     abstract eval(message: Message, args: string[]): any 
}