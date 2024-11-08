const https = require('https');

module.exports = {
    send
}



function send(options, callback, gameName) {

    const req = https.request(options, res => {

        let rawData = '';
        res.setEncoding('utf8');
        res.on('data', chunk => rawData += chunk);

        res.on('end', () => {
            if (!rawData) {
                return console.log('No data');
            }
            callback(rawData);
        });
    });


    req.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
    });

    // Write data to request body
    req.write(`[{"operationName":"DirectoryPage_Game","variables":{"name":"${gameName}","options":{"sort":"RELEVANCE","recommendationsContext":{"platform":"web"},"requestID":"JIRA-VXP-2397","freeformTags":null,"tags":[]},"sortTypeIsRecency":false,"limit":9},"extensions":{"persistedQuery":{"version":1,"sha256Hash":"df4bb6cc45055237bfaf3ead608bbafb79815c7100b6ee126719fac3762ddf8b"}}}]`);
    req.end();
}





