

module.exports = async (msg, args) => {
    
    
    const { PermissionsBitField } = require('discord.js');


    // Seuls les admins peuvent utiliser cette commande
    if (!msg.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return msg.channel.send(`${msg.member.displayName}, seuls les administrateurs du serveur peuvent utiliser cette commande.`);
    }

    if (args.length < 1) {
        return msg.channel.send('Il faut préciser le nouveau préfixe, stp.');
    }


    const newPrefix = args[0];
    
    if (newPrefix.length > 4) {
        return msg.channel.send("Le nouveau préfixe ne doit pas dépasser 4 caractères, stp.");
    }

    if (newPrefix.includes("\\") || newPrefix.includes('"') || newPrefix.includes("'")) {
        return msg.channel.send("Le nouveau préfixe ne peut pas contenir les caractères suivant : " + `'\"`);
    }
    
    if (newPrefix.length < 1) {
        return;
    }


    // Sauvegarde du nouveau préfixe
    data.save('PR' + msg.guild.id, newPrefix);
    msg.channel.send("Le préfixe de ce serveur a bien été mis à jour, " + msg.member.displayName);
}

