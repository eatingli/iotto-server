const express = require('express');
const webServer = express();
const fs = require('fs');
const path = require('path');
import MCSLiteWebsocketClient from './mcs-lite-websocket-client'

let devices = fs.readFileSync(path.join(__dirname, '..', 'data', 'devices.json'));
devices = JSON.parse(devices);

// let devices = [{
//         "id": "H1PP5SS0Z",
//         "key": "f2b5f8b8ba0f4cadf35484227899d618b18d4862e87c36944a1dab0e58949bcf"
//     },
//     {
//         "id": "BkAGtnSAb",
//         "key": "708c420cfdc9762060a35e7ab0ad2459cc11c36dad998fbcd3e890d16d78c487"
//     }
// ];

(async() => {
    let mcsClientList = devices.map((d) => new MCSLiteWebsocketClient('127.0.0.1', 8000, d.id, d.key));
    // let mcsClient = new MCSLiteWebsocketClient('127.0.0.1', 8000, 'H1PP5SS0Z', 'f2b5f8b8ba0f4cadf35484227899d618b18d4862e87c36944a1dab0e58949bcf');
    for (let mcsClient of mcsClientList) {
        await mcsClient.connect();
        mcsClient.on('close', () => {
            console.log('Connection Closed');
        });

        mcsClient.on('error', (err) => {
            console.error("Connection Error:", err);
        });

        mcsClient.on('message', (data) => {
            // console.log('On Data', data);
        });
    }
    console.log('connected!');

    webServer.use(express.static(path.join(__dirname, '..', 'www')));

    webServer.post('/api/data/datachannelId/:datachannelId/value/:value', function (req, res) {
        let datachannelId = req.params.datachannelId;
        let value = Number(req.params.value);
        console.log('mob', datachannelId, value);

        for (let mcsClient of mcsClientList) {
            mcsClient.send(datachannelId, {
                value: value
            });
        }
        return res.send('success');
    });

    webServer.listen(3001, function () {
        console.log('Server listening on port 3001!');
    });

})()