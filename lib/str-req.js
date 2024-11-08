const request = require('./request.js');
const {EmbedBuilder} = require('discord.js');


const listStreams = data.read(`LS`) || [];
const listStreamers = [];
const listBans = [];


module.exports = {
    send,
    listStreams,
    listStreamers
}

let nodes;

const hdrs = {
    'Content-Type': 'text/plain;charset=UTF-8',
    'Connection': 'keep-alive',
    'Client-Id': 'f3mne22kx3ncx6brgo94lxi5h1ko',
    'Accept-Language': 'fr-FR'
};

const options = {
    port: 443,
    method: 'POST',
    hostname: 'gql.twitch.tv',
    headers: hdrs
};




function send(gameName) {
    options.path = '/gql';
    request.send(options, sendStreams, gameName);
}


async function sendStreams(datap) {

    if (!datap) {
        console.log('NO DATA');
        return;
    }
    

    nodes = [];

    datap = JSON.parse(datap);
    //console.log("DATA:")
    //console.log(data);
    returnNodes(datap);

    if (!nodes.length) {
        return;// gb.st_chan.send("No stream for this game at the moment.");
    }


    
    while (listStreams.length > 35)
        listStreams.shift();

    while (listStreamers.length > 4)
        listStreamers.shift();



    const streamEmbed = new EmbedBuilder().setColor('#2f9afb');


    // Pour chaque stream
    for (const n of nodes) {

        //console.log(`Should have seen stream ID ${n.id}`);

        // Vérif des bans
        if (listStreams.includes(n.id) || listStreamers.includes(n.broadcaster.login) || listBans.includes(n.broadcaster.login)) {
            continue;
        }

        listStreams.push(n.id);
        //console.log(`Should have sent stream ID ${n.id}`);
        listStreamers.push(n.broadcaster.login);
        
        data.save(`LS`, listStreams);


        streamEmbed.setTitle('New Rayman stream by ' + n.broadcaster.displayName)
            .setDescription(n.title + `\n` + 'https://www.twitch.tv/' + n.broadcaster.login)
            .setThumbnail(n.broadcaster.profileImageURL.replace('50x50', '150x150'))
            .setFooter({text:`Category: ${n.game.displayName} | stream ID: ${n.id}`});
        
        // Rayman streams
        const wh = await client.fetchWebhook('1193869849714233344');

        wh.send({ embeds: [streamEmbed] });
        await sleep(5000);
    }
}



function returnNodes(obj) {

    for (const e in obj) {
        if (typeof obj[e] !== 'string') {
            if (e !== 'node')
                returnNodes(obj[e]);
            else if (obj[e].broadcaster)
                nodes.push(obj[e]);
        }
    }
}



function sleep(ms) {
    return new Promise(res => setTimeout(res, ms));
}

