
module.exports = async msg => {

    const server = await client.guilds.fetch(msg.guild.id);
    const nboost = server.premiumSubscriptionCount;

    msg.channel.send(
        `Ce serveur possède ${nboost} boosts.`
    );




    if (msg.guildId !== '1187788282843643974') {
        return;
    }


    // Edite le salon vocal des boosts

    const voc = client.channels.resolve('1225743432358559805');
    voc.edit({
        name: `Boosts : ${nboost}`
    }).catch(e => {});
};
