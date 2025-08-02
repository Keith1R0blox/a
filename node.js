// server-status.js
const express = require('express');
const dgram = require('dgram');
const app = express();
const PORT = 3000;

app.get('/status', async (req, res) => {
  const client = dgram.createSocket('udp4');
  const serverIp = 'keith.noveserver.playit.plus';
  const serverPort = 1552;
  let isOnline = false;

  client.send('ping', serverPort, serverIp, (err) => {
    if (!err) {
      isOnline = true;
    }
    client.close();
    res.json({ status: isOnline ? 'online' : 'offline' });
  });

  client.on('error', () => {
    client.close();
    res.json({ status: 'offline' });
  });
});

app.listen(PORT, () => {
  console.log(`Status server running on port ${PORT}`);
});
