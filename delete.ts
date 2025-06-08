import { Client, GatewayIntentBits } from 'npm:discord.js';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
    ]
});

client.once('ready', async () => {
    console.log(`✅ Logged in as ${client.user?.tag}`);

    const targetUserId = '819191621676695563';

    try {
        const user = await client.users.fetch(targetUserId);
        const dmChannel = await user.createDM();

        let hasMore = true;
        while (hasMore) {
            const messages = await dmChannel.messages.fetch({ limit: 100 });
            const botMessages = messages.filter(
                (msg) => msg.author.id === client.user?.id
            );

            if (botMessages.size === 0) {
                hasMore = false;
                break;
            }

            for (const msg of botMessages.values()) {
                try {
                    await msg.delete();
                } catch (err) {
                    console.warn(`⚠️ Failed to delete message ${msg.id}:`, err);
                }
            }
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        console.log(`✅ Deleted all bot messages in DM with ${user.tag}`);
    } catch (error) {
        console.error('❌ Failed to clear DM messages on startup:', error);
    }
});

client.login();
