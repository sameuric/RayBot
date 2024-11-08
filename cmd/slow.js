


module.exports = async (msg, args) => {



    // Seuls les admins peuvent utiliser cette commande

    const {PermissionsBitField} = require('discord.js');

    if (!msg.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        msg.channel.send(`${msg.member.displayName}, seuls les administrateurs du serveur peuvent utiliser cette commande.`).catch(e => {});
        return;
    }
    
    

    const nrg = args.length;

    if (nrg === 0) {
        msg.channel.send('Merci de préciser en argument le nombre de secondes du mode lent').catch(e => {});
        return;
    }


    const n = Number(args[0]);

    if (Number.isNaN(n) || n < 0 || n > 50000) {
        msg.channel.send("Le premier argument doit être un nombre stp");
        return;
    }



    if (nrg === 1) {
        if (!msg.channel.manageable) {
            msg.channel.send("Je n'ai pas la permission de gérer ce salon");
            return;
        }
        msg.channel.setRateLimitPerUser(n).then(() => {
            out(msg.channel, msg.channel.name, msg.channel.rateLimitPerUser);
        }).catch(e => {});
        return;
    }


    if (nrg === 2) {
        const ch = client.channels.resolve(getId(args[1]));

        if (!ch || !ch.manageable) {
            msg.channel.send("Je n'ai pas les permissions de gérer ce salon");
            return;
        }

        ch.setRateLimitPerUser(n).then(() => {
            out(msg.channel, ch.name, ch.rateLimitPerUser);
        });
    }
};


function out(channel, chName, chRate) {
    channel.send(
        "```Salon:       "+chName+
        "\nMode lent:   "+chRate+" sec.```"
    );
}


function getId(param) {
    const regex = /[^0-9]/g;
    return param.replace(regex, '');
}