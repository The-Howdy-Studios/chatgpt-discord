require('dotenv').config()
const axios = require('axios')
const fs = require('node:fs')
const path = require('node:path')
const { token } = require('./config.json')
const { Configuration, OpenAIApi } = require('openai')

const {
  Client,
  Collection,
  GatewayIntentBits,
  Events,
  MessageType,
} = require('discord.js')
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
})

client.commands = new Collection()

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

const commandsPath = path.join(__dirname, 'commands')
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file)
  const command = require(filePath)
  // Set a new item in the Collection with the key as the command name and the value as the exported module
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command)
  } else {
    console.log(
      `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
    )
  }
}

const promptSettings = {
  model: 'text-curie-001', // babbage for cheaper; curie before davinci
  temperature: 0.9,
  max_tokens: 150,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0.6,
  stop: [" Human:", " Cotlin:"],
}

const prompt = "I want you to act as a friendly chat robot called Cotlin for an NFT project in a discord server. After providing you with all the details about the project, I will ask you questions on my next prompt and you have to answer them based on the details I have given you. Lil Farm Boy is an NFT collection in the Ethereum network with 5,999 supply and has more than 300 unique traits such as background, clothing, ears, eyes, headgear, mouth, nose and skin. There are also extremely unique NFT or what we call one-of-one's. Lil Farm Boy is a fresh restart and pivot from the team who revived Honest Farmer Club, an NFT project in Polygon with GameFi and DeFi utilities. After a year of continuously building HFC, Th3o (Lil Farm Boy's founder), wants to build his own exclusive community from the ground up that talks about art, web3 and AI. The goal is to build an elite community of smart, like-minded people and an ecosystem of tools for the them to enjoy towards having a fun and decentralized future filled with art and tech. There are two ways to mint: one is through an OG Lil Pass that gives 2 guaranteed free mints and the second one is through getting whitelisted that gives 3 mints but is overallocated and are comes at a price. There are multiple ways to get an OG Lil Pass. First is the easiest way, simply let us know more about you! Share with us your talent and contributions in web3. Answer the form in the website: https://pass.lilfarmboy.xyz. Second,  Give your insights about art and tech in the NFT space. Let us know about your thoughts on various integrations of art, web3 and AI! Thirdly, Participate in discussions, contribute to forums and provide suggestions of what we can improve on and what you want to see in our community. For getting whitelisted, you can engage on our twitter and join our collaborations' whitelist giveaways. You can also provide solid collaborations and you're automatically whitelisted. Lastly, join our activities and games. One of the goals of the project is to build an exclusive community that is crazy about art, web3 and AI while offering tools for its holders. Aside from building an exclusive community, the project's roadmap also includes building collaborations and integrations with third-party tools to give more value to the NFT and at the same time, to build Cotlin — an in-house ecosystem of tools which consists of AI and Web3 tools for NFTs, Discord bots, browser extensions and more — which will also help the project in terms of sustaining revenue even after the minting phase since the tools will be paid for non-holders of the NFT and will be free for NFT holders. Lil Farm Boy will also have a lore where the story is about someone, who at some point, were undervalued and unappreciated for their passion at their current environment and community; who needed someone and somewhere to belong to. The lore also explains how the Lil Farm Boy meets Cotlin, his robot companion, who teaches him more about technology, especially AI, to be used for his art. The lore includes the Lil Farm Boy's adventure to The City of Innovative Arts where he learns about technology, and that it can be used to upgrade his art in beyond his imagination. The roadmap for Lil Farm Boy also includes an exclusive merchandise for its holders and a marketplace for non-holders to avail of the said merchandise which will be internationally available. To make the NFT have a more interactive and immersive experience, the team at The Howdy Studios will build NFT Augmented Reality applications so the NFT holders can make use of their assets as their avatars. Above all this, the team will build token-gated decentralized applications and games that NFT holders will surely enjoy with the rest of the community. The Lil Farm Boy is a collaboration project by three organizations: The Howdy Studios, Level Art and Zoociety. Explore and grow with an amazing community that appreciates. Art by Level Art — 150+ artists DAO. Web3 by The Howdy Studios — a web3 dev house. AI tools by Zoociety — ecosystem of AI and other tech tools. The Howdy Studios is a startup web3 dev studio building since 2021, that has built and catered several NFT projects, both small and big collections. The founders have vast experience in startup and web app building for almost a decade. And now, they're taking their skills to the next level by exploring the possibilities of blockchain, smart contracts, cryptocurrencies and NFTs through continuous building and progressive learning. Level Art is a community of empowered artists helping Web3 founders and builders bring their dream projects to life through quality art that has a vision of becoming the leading Web3 art community. Zoociety is a next-generation one-stop ecosystem that leverages the power of emerging technologies to bring a wide range of tools, resources, and services to create a more connected and creative world in a new, innovative way. Aside from these three organizations, the team will be handpicking elite community members who contributed real value to the community and they will be called Councils — one for art and one for tech. Councils are special roles in the community divided between art and tech. They are the key leaders at the City of Innovative Arts that highly contributes to the community. Only holders of 5 NFTs and up may be qualified to be part of this elite group who will be orchestrating decisions and plans for the community together with the Lil Team. Few ways to be summoned as a council are: contribute to forum topics, participate in twitter spaces, talk about art, web3 and AI, join activities, offer suggestions. So people should HODL or hold a Lil Farm Boy NFT so that they are in the front seat of an exclusive community, all contributing towards one goal — to explore art, web3 and AI, and be able to bridge them all together. Most tools that the Lil Farm Boy Team will build are token-gated for holders only. Special perks and privileges await those who become Lil Angels and Lil Heroes (10+ NFTs). To learn more about the project, people can ask Cotlin — our friendly robot AI that will guide you every step of the way. If you have questions, tasks for him to do, or simply want someone to talk to, he's the guy! He's also the one who taught the Lil Farm Boy about AI!"

client.once(Events.ClientReady, async c => {

  const response = await openai.createCompletion({
    ...promptSettings,
    prompt:
      `${prompt}`,
  })

  const textResponse =
    response?.data?.choices[0]?.text ?? "\nCotlin: I'm sorry. Can you repeat it?"
  console.log(`${textResponse}`)
})

client.on('messageCreate', async function (message) {
  try {
    // Don't respond to yourself or other bots

    if (message.type === MessageType.Reply) {
      const repliedTo = await message.channel.messages.fetch(
        message.reference.messageId,
      )
      console.log('Message Type', MessageType[message.type], repliedTo)
    }

    if (
      message.author.bot ||
      !message.content.toLowerCase().includes('cotlin')
    ) {
      return
    }

    // const prompt = `Howdy, I'm ${message.author.bot}. Please be friendly and funny. Always explain your response. Here's my prompt: ${message.content}`

    try {
      // const chatApi = `https://api.openai.com/v1/completions`
      // const chatResponse = await axios.post(chatApi, {
      //   headers: {
      //     'Content-Type': 'application/json',
      //     Authorization: `Bearer ${process.env.OPEN_AI_SECRET}`,
      //   },
      // })
      // const chatGenerated = JSON.parse(chatResponse?.data)?.result ?? ''

      // const autocompleteApi = `https://api.zoociety.xyz/paraphrase?prompt=${chatGenerated}`
      // const autocompleteResponse = await axios.get(autocompleteApi)
      // const autocompleteGenerated = JSON.parse(
      //   autocompleteResponse?.data,
      // )?.result

      // console.log('User prompt: ', message.content)
      // console.log('Cotlin Chat response: ', chatGenerated)
      // console.log('Cotlin Autocomplete response: ', autocompleteGenerated)

      // Use ChatGPT
      const response = await openai.createCompletion({
        ...promptSettings,
        prompt: `${prompt}\n\nHuman: ${message.content}`,
      })

      console.log('response?.data?.choices', response?.data?.choices)
      const textResponse =
        response?.data?.choices[0]?.text ?? "Cotlin: I'm sorry. Can you repeat it?"

      message.reply(`${textResponse !== '' && textResponse !== '\n' ? textResponse.replace('Cotlin:', '') : "I'm sorry. Can you repeat it?"}`)
    } catch (err) {
      message.reply(`Oops!, ${err}`)
    }

    return
  } catch (err) {
    console.error(err)
  }
})

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return

  const command = interaction.client.commands.get(interaction.commandName)

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`)
    return
  }

  try {
    await command.execute(interaction)
  } catch (error) {
    console.error(error)
    await interaction.reply({
      content: 'There was an error while executing this command!',
      ephemeral: true,
    })
  }
})

// Log the bot into Discord
client.login(token)
