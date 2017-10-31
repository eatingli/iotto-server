const express = require('express');
const app = express();
const path = require('path');
import MCSLiteWebsocketClient from './mcs-lite-websocket-client'


(async() => {
    let client = new MCSLiteWebsocketClient('192.168.1.169', 8000, 'H1PP5SS0Z', 'f2b5f8b8ba0f4cadf35484227899d618b18d4862e87c36944a1dab0e58949bcf');

    await client.connect();
    console.log('connected!');

    client.on('close', () => {
        console.log('Connection Closed');
    });

    client.on('error', (err) => {
        console.error("Connection Error:", err);
    });

    client.on('message', (data) => {
        // console.log('On Data', data);
    });

    app.use(express.static(path.join(__dirname, '..', 'www')));

    app.post('/api/data/datachannelId/:datachannelId/value/:value', function (req, res) {
        let datachannelId = req.params.datachannelId;
        let value = Number(req.params.value);
        console.log('mob', datachannelId, value);
        client.send(datachannelId, {
            value: value
        });
        return res.send('success');
    });

    app.listen(3000, function () {
        console.log('Example app listening on port 3000!');
    });

})()