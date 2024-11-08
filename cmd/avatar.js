module.exports = async (msg, args) => {

    let ppURL;

    if (msg.channel.id === '1187788283468587060') {
        return;
    }



    // Vérifie les arguments

    const snowflake  =  /^[0-9]{10,}$/;
    const uid        =  (!args.length) ? msg.author.id : getId(args[0]);

    if (!snowflake.test(uid)) {
        return msg.channel.send("L'identifiant fourni n'est pas valide").catch(e => {});
    }



    // Vérifie si c'est un membre du serveur

    const user = await msg.client.users.fetch(uid).
                 catch(e => {});

    if (!user) {
        return msg.channel.send("Cet utilisateur n'existe pas ^^").catch(e => {});
    }

    ppURL = user.displayAvatarURL({extension:'png', size:1024});




    const member = await msg.guild.members.fetch(user).
                   catch(e => {});

    if (member) {
        ppURL = member.displayAvatarURL({extension:'png', size:1024});
    }






    // Embed
    msg.channel.send({
        embeds: [{
            image: {
                url: ppURL
            },
            title: `Avatar de ${user.tag}`,
            //description: ',
            'color': 0x00f9ff
        }]
    }).catch(e => {});
}



// Retourne l'ID contenu dans une mention

function getId(param) {
    const regex = /[^0-9]/g;
    return param.replace(regex, '');
}

