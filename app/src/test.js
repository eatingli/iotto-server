
import MCSLiteWebsocketClient from './mcs-lite-websocket-client'

function delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time))
}

(async() => {
    let client = new MCSLiteWebsocketClient('192.168.1.169', 8000, 'BJ12kXNAb', '2787415e669627bc419bc2ce6c523e380e7676d6341919a87d6cd956109e648c');

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

    // try {
    //     let i = 0;
    //     while (true) {
    //         // break;
    //         let v = i++ % 1;
    //         console.log('Send', v)
    //         client.send('1', {
    //             value: v
    //         });
    //         client.send('2', {
    //             value: v
    //         });
    //         await delay(1000)
    //     }
    //     // Read
    //     while (true) {

    //     }
    // } catch (e) {
    //     console.error('err')
    // }

})()