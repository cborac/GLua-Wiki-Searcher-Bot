import { Client, Collection } from "discord.js"
import { config } from "dotenv"
import { readdirSync } from "fs"
import { Command } from "./Command"

config()

const client: { commands?: Collection<string, Command> } & Client = new Client()
client.commands = new Collection()

client.on("ready", () => console.log("Ready!"))

readdirSync("./dist/commands").forEach(async x => {
     if (x.endsWith(".map")) return

     const command = new (require("./commands/" + x).default)(client);

     for (const variation in command.variations){
          client.commands.set(command.variations[variation], command);
     }
})

client.on("message", msg => {
     if (!msg.guild || msg.author.bot || !msg.content.startsWith("?")) return
     const args = msg.content.split(" ").map(x => x.trim())


     const cmd = client.commands.get(args[0].substring(1))

     if (cmd) cmd.eval(msg, args)
})

client.login(process.env.TOKEN)