const express = require('express');
const dgram = require('dgram');
const app = express();
const PORT = 3000;

app.get('/status', (req, res) => {
  const client = dgram.createSocket('udp4');
  const serverIp = 'keith.noveserver.playit.plus';
  const serverPort = 1552;
  let responded = false;

  const message = Buffer.from('ping'); // Send a basic "ping"

  client.send(message, serverPort, serverIp, (err) => {
    if (err) {
      client.close();
      return res.json({ status: 'offline', error: err.message });
    }

    // Timeout: if no response within 2 seconds, assume offline
    setTimeout(() => {
      if (!responded) {
        client.close();
        return res.json({ status: 'offline' });
      }
    }, 2000);
  });

  client.on('message', (msg, rinfo) => {
    responded = true;
    client.close();
    res.json({ status: 'online', response: msg.toString() });
  });

  client.on('error', (err) => {
    client.close();
    res.json({ status: 'offline', error: err.message });
  });
});

app.listen(PORT, () => {
  console.log(`Status server running on port ${PORT}`);
});
