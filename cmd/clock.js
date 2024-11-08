

module.exports = msg => {

    const hrs = (new Date()).getHours();
    const mins = (new Date()).getMinutes();

    msg.reply(
        `Il est ${hrs}:${mins}`
    );
};
