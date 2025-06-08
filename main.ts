// deno-lint-ignore-file require-await
import process from "node:process";
import { Client, GatewayIntentBits } from 'npm:discord.js';
import express, { Request, Response } from 'npm:express';
import { sendIP, sendStop } from "./utils.ts";

const app = express();
const port = 5000;
app.use(express.json());

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
    ]
});

const raw = await Deno.readTextFile("./id.json");
const j = JSON.parse(raw);
const hehe_ids = j.ids
console.log(hehe_ids);

client.once('ready', async () => {
    console.log(`Logged in as ${client.user?.tag}`);
    try {
        app.post('/ip-to-user', async (req: Request, res: Response) => {
            const { ip } = req.body;
            if (ip) {
                const simpleIp = ip.replace("tcp://", "")
                for (let i = 0; i < hehe_ids.length; i++) {
                    await sendIP(client, hehe_ids[i], simpleIp)

                }
            }
            res.send('');
        });

        app.post('/stop', async (req: Request, res: Response) => {
            const { time } = req.body;
            if (time) {
                for (let i = 0; i < hehe_ids.length; i++) {
                    await sendStop(client, hehe_ids[i], time)

                }
            }
            res.send('');
        });

        app.listen(port, () => {
            console.log(`love ayaka on: http://localhost:${port}`);
        });
    } catch (err) {
        console.error(err);
    }
});

client.login(j.token);
if (process.argv[2] === 'stop') {
    await client.destroy();
    process.exit(0);
}
