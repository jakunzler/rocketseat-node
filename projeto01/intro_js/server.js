import http from 'node:http';

const server = http.createServer((req, res) => {
  res.end('Hello World of Node.js');
})

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
})