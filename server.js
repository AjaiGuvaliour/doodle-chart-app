const path = require('path');
const http = require('http');
const cors = require('cors')
const { main, express } = require('./server/main');
const connectDb = require('./server/db-config/connection');
connectDb();
main.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, content-type, Accept, token');
  next();
});
main.use(express.static(path.join(__dirname, 'dist')));
main.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/server_index.html'));
});

const port = process.env.PORT || '3000';
main.set('port', port);
const server = http.createServer(main);
server.listen(port);
