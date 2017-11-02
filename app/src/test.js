import MCSLiteWebsocketClient from './mcs-lite-websocket-client'

function delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time))
}

(async() => {
    let client = new MCSLiteWebsocketClient('127.0.0.1', 8000, 'H1PP5SS0Z', 'f2b5f8b8ba0f4cadf35484227899d618b18d4862e87c36944a1dab0e58949bcf');

    await client.connect();
    console.log('connected!');

    client.on('close', () => {
        console.log('Connection Closed');
    });

    client.on('error', (err) => {
        console.error("Connection Error:", err);
    });

    client.on('message', (data) => {
        console.log('On Data', data);
    });

    client.onData('1', (values) => {
        console.log('value:', values);
    })

    client.onData('2', (values) => {
        console.log('value:', values);
    })

    try {
        let i = 0;
        while (true) {
            // break;
            let v = i++ % 2;
            console.log('Send', v)
            client.send('key_north', {
                value: v
            });
            client.send('key_south', {
                value: v
            });
            await delay(1000)
        }
        // Read
        while (true) {

        }
    } catch (e) {
        console.error('err')
    }

})()