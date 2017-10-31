const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, '..', 'www')));

app.post('/key/:button/:status', function (req, res) {
    console.log(req.params.button, req.params.status);
    return res.send('success');
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});