const app= require('http').createServer(server);
const io = require('socket.io')(app);
const fs = require('fs');
const spawn = require('child_process').spawn;

app.listen(3000);

function server (req, res) {
  fs.readFile(__dirname + '/test.html',
    function (err, data) {
      if (err) {
        res.writeHead(500);
	return res.end('Error loading index.html');
      }

      res.writeHead(200);
      res.end(data);	
    }
  );
}

io.on('connection', function(socket) {
  var raspivid = spawn('raspistill', ['-w', '320', '-h', '240', '-t', '0', '-n', '-o', '-', '-tl', '100']);
  var data;
  raspivid.stdout.on('data', function (chunk) {
    socket.emit('frame', new Buffer(chunk).toString('base64') );
  });
  raspivid.stdout.on('end', function() {
  });
});
