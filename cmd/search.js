

let disabled = false;
const BL = ['tf1+'];


module.exports = (msg, args) => {

    if (!PERSO[msg.guildId]) {
        return;
    }

    if (disabled) {
        msg.channel.send("Cette commande ne peut être utilisée que toutes les 5 secondes <:anooroo:1038907822127190146>");
        return;
    }
    
    
    // Gestion du slowmode
    
    disabled = true;
    setTimeout(() => {
        disabled = false;
    }, 1000 * 5);



    let searchTerm = "rayman";
    
    if (args.length > 0) {

        searchTerm = args[0];

        if (args.length > 1) {
            searchTerm = args.join(' ');
        }
    }

    actu(msg, searchTerm);
};



async function actu(msg, searchTerm) {


    // Request params

    const fetch = global.fetch || require('node-fetch');
    const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36';



    // Request

    let body = fetch(
        `http://www.google.com/search?${new URLSearchParams({tbm: "nws", hl: "fr", source: "lnt", tbs: "sbd:1", sa: "X", lr: "lang_fr", q: searchTerm })}`, {headers: {'User-Agent': userAgent}}
    );






    // At the same time as the request

    const sourcesReg = /<span>[^<]+/ig;
    const titleRegex = /clamp:3">[^<]+/ig;
    const imRegex = /jpeg;base64,[a-z0-9\/\+]*/ig;
    const hrefRgx = /href="https?:\/\/(www\.)?[-a-z0-9@:%._\+~#=]{1,256}\.[a-z0-9()]{1,6}\b([-a-z0-9()@:%_\+.~#?&//=]*)/gi;


    const images = [];
    const realLinks = [];
    const realTitles = [];
    const realSources = [];



    const {EmbedBuilder, AttachmentBuilder} = require('discord.js');
    const {ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');




    // End the request
    body = await body.then(res => res.text());




    // Parsing images

    for (const img of body.matchAll(imRegex)) {
        images.push(img[0].split(',')[1]);
    }

    if (images.length === 0) {
        msg.channel.send("Aucune actualité récente n'a été trouvée sur ces mots-clefs")
        return;     // Aucune actualité trouvée
    }

    body = body.slice(body.lastIndexOf('Résultats de recherche'), body.lastIndexOf('bottomads'));





    // Liens

    const links = body.matchAll(hrefRgx);

    for (const li of links) {
        realLinks.push(li[0].split('="')[1]);
    }

    //console.log(realLinks[n]);





    // Titres & descriptions

    const titles = body.matchAll(titleRegex);

    for (const li of titles) {
        const el = li[0].split('>')[1];
        realTitles.push(el.replaceAll("\n", '').replaceAll("\r", ''));
    }

    //console.log(realTitles[n]);




    // Dates & sites sources

    const sources = body.matchAll(sourcesReg);

    for (const li of sources) {
        realSources.push(li[0].split('>')[1]);
    }




    // Build & clean the fetchedActus array

    for (let i = 1; i <= images.length; ++i) {


        // Check if actu already sent  

        const truc = realTitles[2*(i-1)] + realSources[2*(i-1)];

        if (!truc) {
            console.log('truc:');
            console.log(truc);
            console.log(realTitles[2*(i-1)]);
            console.log(realSources[2*(i-1)]);
            console.log(images.length);
            console.log(realLinks.length);
            console.log(realSources.length);
            console.log(realTitles.length);
            console.log('------------------');
            continue;
        }



        const src_hash = realSources[2*(i-1)].trim().toLowerCase();
        const actu_hash = truc.replace(/[^e-z0-5]/g, '');

        

        const tit = realTitles[2*(i-1)];

        

        

        // Thumbnail
        const buf = new Buffer.from(images[i-1], 'base64');
        const file = new AttachmentBuilder(buf, {name: 'img.png'});
            
        // Post de l'embed

        const ebd = new EmbedBuilder()
            .setColor(0x00baef)
            .setTitle(tit.replaceAll("\n", '').replaceAll("\r", ''))
            .setDescription(realTitles[1+2*(i-1)].replaceAll("\n", '').replaceAll("\r", '') + '\n\n[' + beautyLink(realLinks[i-1]) + '](' + realLinks[i-1] + ')')
            .setThumbnail('attachment://img.png')
            .setFooter({ text: 'Posté par ' + realSources[2*(i-1)] + '  |  ' + realSources[1+2*(i-1)]});


        
        
        // Send Embed
        msg.channel.send({
            embeds: [ebd],
            files: [file]
        }).catch(e => {});
        
        
        break;
    }
}



function beautyLink(str) {

    const br = 50;
    str = str.replace('http://', '');
    str = str.replace('https://', '');

    if (str.length < 50) {
        return str;
    }

    return str.slice(0, 50) + '...';
}


