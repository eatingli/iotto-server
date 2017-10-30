const WebSocketClient = require('websocket').client;
const EventEmitter = require('events').EventEmitter;
const crypto = require('crypto');

// todo: 針對各通道監聽

/**
 * 1. 傳送的資料不包含通道型別
 * 2. Websocket版本不能主動問狀態，所以有初始化需求時，可能會有問題
 * 3. 只要有提交新狀態，不論實際上有沒有改變，Reader都會收到狀態
 * 4. msg: {"datachannelId":"pwm","values":{"value":"31","period":"8"}}
 */

export default class MCSLiteWebsocketClient extends EventEmitter {

    /**
     * 
     * @param {String} host 
     * @param {Number} port 
     * @param {String} deviceId 
     * @param {String} deviceKey 
     * @param {String} type 
     */
    constructor(host, port, deviceId, deviceKey, type = 'json') {
        super();

        this.host = host;
        this.port = port;
        this.deviceId = deviceId;
        this.deviceKey = deviceKey;
        this.type = type;

        this._senderClient = new WebSocketClient();
        this._readerClient = new WebSocketClient();

        this.reader = null;
        this.sender = null;
    }

    _channelToSha1(datachannelId) {
        let sha1 = crypto.createHash('sha1');
        sha1.update(datachannelId);
        return sha1.digest('hex');
    }

    connect() {

        let self = this;

        function readerConnect() {
            return new Promise((resolve, reject) => {

                // Reader Connect
                let type = self.type == 'csv' ? 'csv' : 'viewer'; // csv | json
                self._readerClient.connect(`ws://${self.host}:${self.port}/deviceId/${self.deviceId}/deviceKey/${self.deviceKey}/${type}`, '');
                self._readerClient.on('connectFailed', function (err) {
                    reject(err);
                });

                self._readerClient.on('connect', function (connection) {
                    self.reader = connection;
                    connection.on('error', (err) => self.emit('error', err));
                    connection.on('close', () => {
                        self.reader = null;
                        self.emit('close');
                    });
                    connection.on('message', (msg) => {
                        if (self.type == 'json') {
                            let json = JSON.parse(msg.utf8Data);
                            self.emit('message', json);
                            self.emit(self._channelToSha1(json.datachannelId), json.values);

                        } else if (self.type == 'csv')
                            self._onMessage(msg)
                        else
                            self._onMessage(msg)
                    });
                    resolve();
                });
            })
        }

        function senderConnect() {
            return new Promise((resolve, reject) => {

                // Sender Connect
                self._senderClient.connect(`ws://${self.host}:${self.port}/deviceId/${self.deviceId}/deviceKey/${self.deviceKey}`, '');
                self._senderClient.on('connectFailed', function (err) {
                    reject(err);
                });

                self._senderClient.on('connect', function (connection) {
                    self.sender = connection;
                    connection.on('error', (err) => this.emit('error', err));
                    connection.on('close', () => {
                        self.sender = null;
                        self.emit('close');
                    });
                    resolve();
                });
            })
        }

        return new Promise((resolve, reject) => {
            readerConnect()
                .then(() => senderConnect())
                .then(() => {
                    resolve();
                })
                .catch((err) => {
                    reject(err);
                })
        })
    }

    /**
     * 
     * @param {String} datachannelId 
     * @param {Function} callback 
     */
    onData(datachannelId, callback) {
        this.on(this._channelToSha1(datachannelId), callback)
    }

    /**
     * 
     * @param {String} datachannelId 
     * @param {Function} callback 
     */
    onceData(datachannelId, callback) {
        this.once(this._channelToSha1(datachannelId), callback)
    }

    /**
     * 
     * @param {String} datachannelId 
     * @param {Object} values 
     */
    send(datachannelId, values) {

        if (!this.sender || !this.sender.connected) throw new Error('Sender Connect Status Error');
        let obj = {
            datachannelId: datachannelId,
            values: values
        };
        this.sender.sendUTF(JSON.stringify(obj));
    }
}