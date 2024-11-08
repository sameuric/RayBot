

const request = require('./request.js');

const listVideos = data.read(`LV`) || [];

module.exports = {
    send,
    listVideos
}

let designer = false;

const videos = ['2o3Kvs5wKXA', 'uR3aP5JCfPY', 'cIY5BRNdOsI'];

const KEY_TOKEN = ''; // Your key TOKEN here
const key = '&key=' + KEY_TOKEN;


function send(search) {
    
    designer = (search == 'rayman%20designer');
    const params = 'part=snippet&maxResults=9&order=date&q=' + search + '&type=video&fields=items(id(videoId),snippet(publishedAt))';
    
    request.send({
        port: 443,
        method: 'GET',
        hostname: 'youtube.googleapis.com',
        path: '/youtube/v3/search?' + params + key,
        headers: {
            'Content-Type': 'application/json'
        }
    }, sendVideos);
}


async function sendVideos(pdata) {

    if (!pdata) {
        console.log('BUG DATA:');
        //console.log(data);
        console.log("\n");
        return;
    }
    pdata = JSON.parse(pdata);

    if (!pdata || !pdata.items) {
        console.log('BUG DATA items:');
        //console.log(data);
        console.log("\n");
        return;
    }
    
    //console.log('OK1111')

    for (const item of pdata.items) {

        const vid = item.id.videoId;
        const pat = item.snippet.publishedAt;

        //console.log('OK444');

        /*
         *  Si la vidéo a déjà été postée, on la passe
         */
        if (videos.includes(vid) || listVideos.includes(vid)) {
            continue;
        }

        
        while (videos.length > 50)
            videos.shift();
        while (listVideos.length > 35)
        listVideos.shift();



        /*
         *  Si la vidéo ne date pas d'aujourd'hui, on la passe
         */
        const now = (new Date()).getTime();
        const dat = (new Date(pat)).getTime();

        if (now - dat > 86400000) {
            //console.log(`Video ${vid} skip car trop ancienne`);
            //console.log(`${now} | ${dat} | ${pat}\n`);
            //console.log('skipped');
            continue;
        }
        
        

        videos.push(vid);
        listVideos.push(vid);
        data.save(`LV`, listVideos);

        //const vd_chan = client.channels.resolve('1153964363607195769');
        //const vd_chan_des = client.channels.resolve('1153967863154102313');
        
        //const gb_ch = designer ? vd_chan_des : vd_chan;
        
        // Rayman videos
        const wh = await client.fetchWebhook('1193869712497582120');
        
        if (designer) {
            wh.send(`New Rayman Designer video on YouTube!\nhttps://www.youtube.com/watch?v=${vid}`);
            return;
        }
        wh.send(`New Rayman ${designer ? '' : 'Re'}Designer video on YouTube!\nhttps://www.youtube.com/watch?v=${vid}`);
        return;
    }
}