// Create a Discord Bot using OpenAI API that interacts on the Discord Server
require('dotenv').config();
const axios = require('axios');

// Prepare to connect to the Discord API
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
]})

// Check for when a message on discord is sent
client.on('messageCreate', async function(message) {
    try {
        // Don't respond to yourself or other bots
        if (message.author.bot || !(message.content.toLowerCase()).includes('cotlin')) return;
        
        try {
            const apiUrl = `https://api.zoociety.xyz/dialogue?prompt=${message.content}`;
            const gptResponse = await axios.get(apiUrl);
            const generatedText = JSON.parse(gptResponse?.data)?.generated_text ?? 'Hmm, can you try again?'
            message.reply(`Howdy, ${message.author.username}! ${generatedText}`);
            
    } catch (err) {
        message.reply(`Oops!, ${err}`);
        }
        return;
    } catch (err) {
        console.error(err)
    }
});

// Log the bot into Discord
client.login(process.env.DISCORD_TOKEN)
console.log("Cotlin ChatGPT is online!")