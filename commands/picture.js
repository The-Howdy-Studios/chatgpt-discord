const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const { request } = require("undici");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("picture")
    .setDescription("Cotlin Text-to-Image AI"),
  async execute(interaction) {
    try {
      const message = interaction.message;
      const channel = message.channel;
      const prompt = message.content;
      const apiUrl = `https://api.zoociety.xyz/imagepro?prompt=${prompt}`;
      const gptResponse = await request(apiUrl);
      
      if (gptResponse.status_code !== 200) {
        await interaction.reply(
          `Oops, looks like there was a problem, ${interaction.user.username}: ${gptResponse.reason}`
        );
      }

      const image = gptResponse.body;
      console.log(image);

      const file = new AttachmentBuilder(image);

      const embed = {
        title: `${message.author.username} - ${prompt}`,
        image: {
          url: "attachment://image.png",
        },
      };

      channel.send({ embeds: [embed], files: [file] });
    } catch (err) {
      console.log(err)
      // message.reply(`Oops!, ${err}`);
      return;
    }
  },
};
