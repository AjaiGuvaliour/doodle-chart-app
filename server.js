const path = require('path');
const http = require('http');
const { main, express } = require('./server/main');
const connectDb = require('./server/db-config/connection');
connectDb();
main.use(express.static(path.join(__dirname, 'dist')));
main.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/server_index.html'));
});

const port = process.env.PORT || '3000';
main.set('port', port);
const server = http.createServer(main);
server.listen(port);
