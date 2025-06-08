import { Client } from "npm:discord.js";

function formatReadableTime(seconds: number) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);

    if (hrs > 0) {
        if (mins > 0) {
            return `${hrs} ${hrs === 1 ? 'hour' : 'hours'} ${mins} ${mins === 1 ? 'minute' : 'minutes'}`;
        }
        return `${hrs} ${hrs === 1 ? 'hour' : 'hours'}`;
    }

    if (mins > 0) {
        return `${mins} ${mins === 1 ? 'minute' : 'minutes'}`;
    }

    return `${seconds} ${seconds === 1 ? 'second' : 'seconds'}`;
}

export const sendIP = async (client: Client, id: string, ip: string) => {
    const user = await client.users.fetch(id);
    const msg = `
# Hey , **${user.username}**! :blue_heart:
Here is the **IP**
\`\`\`typescript
${ip}
\`\`\`
    `;
    await user.send(msg);
};

export const sendStop = async (client: Client, id: string, time: number) => {
    const user = await client.users.fetch(id);
    console.log(time);
    const msg = `
# we will play again! 💖
we played for **${formatReadableTime(time)}** ⏰
`;

    await user.send(msg);

};
