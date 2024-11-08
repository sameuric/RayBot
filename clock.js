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




function beautyLink(str) {

    const br = 50;
    str = str.replace('http://', '');
    str = str.replace('https://', '');

    if (str.length < 50) {
        return str;
    }

    return str.slice(0, 50) + '...';
}

