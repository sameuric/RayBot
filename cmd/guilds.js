module.exports = msg => {

    const arr = [], sorted = [];
    const cache = msg.client.guilds.cache;
    let toSend = `${msg.member.displayName}, je suis présent sur ${cache.size} serveurs :\n\n`;

    cache.each(guild => {
        arr.push([guild.name, guild.memberCount]);
    });



    // Tri

    let start = 0;

    while (sorted.length < arr.length && start < 5000) {
        for (const server of arr) {
            if (server[1] === start) {
                sorted.unshift(server);
            }
        }
        start++;
    }



    // Affichage

    for (const server of sorted) {
        toSend += `${server[0]} (${server[1]} membres)\n`;
    }

    msg.channel.send(toSend).catch(e => {});
};

