const vd_req = require('./lib/vid-req.js');
const st_req = require('./lib/str-req.js');



module.exports = () => {
    setInterval(tic, 1000 * 60);
};



async function tic() {

    const hrs = (new Date()).getHours();
    const mins = (new Date()).getMinutes();

    
    // Youtube videos
    
    if (mins%15 === 0) {
        vd_req.send((Date.now() % 2 === 0) ? 'rayman%20designer' : 'rayman%20redesigner');
        return;
    }



    // Streams
    
    if (mins%5 === 1) {
        st_req.send('Rayman ReDesigner');
    }

    else if (mins%5 === 4) {
        st_req.send('Rayman');
    }

    else if (mins%15 === 13) {
        st_req.send('Rayman Designer');
    }
}








// Actus vérifiées sous forme exploitable

function sendCheckedActu() {

    if (!checkedActus) {
        return;
    }

    const actu = checkedActus.shift();
    const chan = client.channels.resolve('1202681219565752330');
    
    if (!actu) {
        return;
    }

    chan.send({
        embeds: [actu]
    }).catch(e => {});
}





// Actus non vérifiées avec la thumbnail

async function sendFetchedActu() {
    
    if (!fetchedActus) {
        return;
    }


    const {EmbedBuilder, AttachmentBuilder} = require('discord.js');
    const {ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');

    const actu = fetchedActus.shift();
    const chan = client.channels.resolve('1202962248591609937');

    if (!actu) {
        return;
    }
    
    
    // Thumbnail
    const buf = new Buffer.from(actu.image, 'base64');
    const file = new AttachmentBuilder(buf, {name: 'img.png'});





    // Button
    const confirm = new ButtonBuilder()
        .setCustomId('actu6318')
        .setLabel('Send')
        .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder()
        .addComponents(confirm);





    // Embed
    const ebd = new EmbedBuilder()
        .setColor(0x00baef)
        .setTitle(actu.title)
        .setDescription(actu.desc)
        .setThumbnail('attachment://img.png')
        .setFooter({ text: 'Posté par ' + actu.source + '  |  ' + actu.time});


    //const m = await chan.send({
    chan.send({
        embeds: [ebd],
        files: [file],
        components: [row]
    }).catch(console.log);
    
    //return m;
}






async function actu(p) {


    // Request params

    const searchTerm = p ? 'disney' : 'disneyland';
    const fetch = global.fetch || require('node-fetch');
    const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36';



    // Request

    let body = fetch(
        `http://www.google.com/search?${new URLSearchParams({tbm: "nws", hl: "fr", source: "lnt", tbs: "sbd:1", sa: "X", lr: "lang_fr", q: searchTerm })}`, {headers: {'User-Agent': userAgent}}
    );






    // At the same time as the request

    if (lastActus === false) {
        lastActus = data.read('actus') || [];
    }

    if (fetchedActus === false) {
        fetchedActus = [];
    }



    const sourcesReg = /<span>[^<]+/ig;
    const titleRegex = /clamp:3">[^<]+/ig;
    const imRegex = /jpeg;base64,[a-z0-9\/\+]*/ig;
    const hrefRgx = /href="https?:\/\/(www\.)?[-a-z0-9@:%._\+~#=]{1,256}\.[a-z0-9()]{1,6}\b([-a-z0-9()@:%_\+.~#?&//=]*)/gi;


    const images = [];
    const realLinks = [];
    const realTitles = [];
    const realSources = [];

    const {AttachmentBuilder, EmbedBuilder} = require('discord.js');






    // End the request
    body = await body.then(res => res.text());




    // Parsing images

    for (const img of body.matchAll(imRegex)) {
        images.push(img[0].split(',')[1]);
    }

    if (images.length === 0) {
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






    // Tentative de résolution
    let sec = 0;

    while (images.length > realLinks.length && ++sec < 50) {
        images.pop();
        //console.log("POP!")
    }
    
    //console.log("----pop-----")
    if (sec > 45) {
        console.log("ERROR 6557");
    }





    // Build & clean the fetchedActus array

    for (let i = 1; i <= images.length; ++i) {


        // Check if actu already sent  

        const truc = realTitles[2*(i-1)] + realSources[2*(i-1)];

        if (!truc && false) {
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

        if (lastActus.includes(actu_hash) || blackList.includes(src_hash) || actu_hash.includes('ophile') || actu_hash.includes('porno')  || actu_hash.includes('viol')  || actu_hash.includes('viol.')  || actu_hash.includes('viol ') || actu_hash.includes('torture')) {
            continue;
        }

        const tit = realTitles[2*(i-1)];

        if (tit.includes('ophile') || tit.includes('porno') || tit.includes('viol')) {
            continue;
        }

        lastActus.push(actu_hash);

        while (lastActus.length > 150) {
            lastActus.shift();
        }

        data.save('actus', lastActus);



        /* Every 2 hours sent a default news

        if (i === 1 && false) {

            fetchedActus.unshift({
                'title'  : realTitles[2*(i-1)],
                'desc'   : realTitles[1+2*(i-1)] + '\n\n[' + beautyLink(realLinks[i-1]) + '](' + realLinks[i-1] + ')',
                'image'  : images[i-1],
                'source' : realSources[2*(i-1)],
                'time'   : realSources[1+2*(i-1)]
            });

            const m = await sendFetchedActu();
            const emb = m.embeds[0];
            
            if (checkedActus === false) {
                checkedActus = [];
            }

            checkedActus.push({
                thumbnail: {
                    url: emb.thumbnail.url
                },
                title: emb.title,
                description: emb.description,
                color: emb.color,
                footer: emb.footer
            });

            continue;
        }
        //*/





        // Add the unseen news in the clean array

        fetchedActus.push({
            'title'  : tit,
            'desc'   : realTitles[1+2*(i-1)] + '\n\n[' + beautyLink(realLinks[i-1]) + '](' + realLinks[i-1] + ')',
            'image'  : images[i-1],
            'source' : realSources[2*(i-1)],
            'time'   : realSources[1+2*(i-1)]
        });
    }
    
    while (fetchedActus.length > 40) {
        fetchedActus.shift();
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

