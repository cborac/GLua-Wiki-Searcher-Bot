import { Client, Message } from "discord.js";

export abstract class Command {
     client: Client;

     constructor(client: Client) {
          this.client = client
     }

     abstract eval(message: Message, args: string[]): any 
}