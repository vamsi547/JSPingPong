var express = require('express');

var app = express();
var path = require('path');

app.use(express.static('./app'));

var IP = "localhost";
var port = 3000;

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
})

app.listen(port, IP, function() {
    console.log(" Listening at port : ", port);
});
