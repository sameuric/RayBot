module.exports = async (msg, args) => {


    // Variables locales
    let embedContent;
    
    const snowflake  =  /^[0-9]{10,}$/;
    const uid        =  (!args.length) ? msg.author.id : getId(args[0]);

    if (!snowflake.test(uid)) {
        return msg.channel.send("L'identifiant fourni n'est pas valide").catch(e => {});
    }



    // Utilisateur
    const user         =  await msg.client.users.fetch(uid).
                          catch(e => {});

    if (!user) {
        return msg.channel.send("Je ne sais pas qui est " + uid);
    }

    const u_created    =  user.createdAt;
    const u_timestamp  =  user.createdTimestamp;
    const member       =  await msg.guild.members.fetch(user).
                          catch(e => {});



    // Contenu de l'embed
    embedContent  =  "Compte créé le " + printDate(u_created)  +
                     " (il y a " + daysFromTsmp(u_timestamp)   +
                     " jours)\n";

    if (!member) {
        embedContent += "Ce membre n'est pas sur " + msg.guild.name;
    }
    else {
        embedContent += "A rejoins le : " + printDate(member.joinedAt)     +
                        " (il y a " + daysFromTsmp(member.joinedTimestamp) +
                        " jours)";
    }



    // Couleur de l'embed
    let color = 0xff00f9;

    if (user.bot) {
        color = 0x00f9ff;
        embedContent += "\n\n**Cet utilisateur est un bot.**";
    }



    // Embed
    msg.channel.send({
        embeds: [{
            thumbnail: {
                url: user.displayAvatarURL({extension:'png', size:1024})
            },
            title: `Informations sur ${user.tag}`,
            description: embedContent,
            'color': color
        }]
    }).catch(e => {});
}



// Retourne l'ID contenu dans une mention

function getId(param) {
    const regex = /[^0-9]/g;
    return param.replace(regex, '');
}


// Retourne la date au format DD/MM/YYYY

function printDate(date) {
    const arr = date.toISOString().slice(0,10).split("-");
    return [arr[2], arr[1], arr[0]].join('/');
}



// Retourne les jours écoulés depuis un timestamp

function daysFromTsmp(timestamp) {
    return Math.floor((Date.now() - timestamp) / (1000*3600*24));
}
