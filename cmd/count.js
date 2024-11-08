
module.exports = async msg => {

    const membersList = await msg.guild.members.fetch();
    const bots = membersList.filter(member => member.user.bot);

    const nbMembres = membersList.size - bots.size;
    msg.channel.send(`Il y a ${nbMembres} humains, et ${bots.size} bots dans ce serveur.`);
}
