/**
  *     Raybot
  *     A Discord bot used in my Rayman's server.
  *
  *     The bot is able to check current Rayman streams online on Twitch,
  *     and send their links into the dedicated Discord channel.
  *
  *     © Sacha Meurice
  *     Please do not copy without written permission.
  */


const BOT_TOKEN = "TOKEN_HERE";


const {Client, GatewayIntentBits, ChannelType} = require('discord.js');
global.client = new Client({intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
]});


// Loading global variables
require('./lib/global');





/**
  *     Client Ready
  *
  *     Event fired when the Discord bot client is online.
  */

client.once('ready', readyClient => {

    console.log('RayBot online!');

    // Set custom status
    const {ActivityType} = require('discord.js');
    client.user.setActivity('Watch to live streams', {type: ActivityType.Custom});

    // Loading clock module
    require('./clock')();
});





// Received messages

client.on('messageCreate', async msg => {


    if (msg.author.bot || msg.channel.type !== ChannelType.GuildText) {
        return;
    }



    // Prefix management

    const prefix = data.read('PR' + msg.guildId) || '!';

    if (msg.content.startsWith(prefix)) {
        return handleCmd(msg, prefix);
    }
});






// Handle text commands

function handleCmd(msg, pr) {

    const args = msg.content.slice(pr.length).trim().split(/ +/);
    let   cmd  = args.shift().toLowerCase().replace(/[^a-z-]/g, '');

    try {
        if (msg.author.id === '828979249029447731') {
            delete require.cache[require.resolve('./cmd/' + cmd)];
        }
        require('./cmd/' + cmd)(msg, args, pr);
    }
    catch(e) {}
}


client.login(BOT_TOKEN);