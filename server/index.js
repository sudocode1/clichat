const { Server } = require('ws');
const express = require('express');

// set the ports you want to host on if you need multiple servers
const ports = [90];
const serverVersion = "25032021";

// set the words you want to filter from usernames and messages
const filter = ["words or phrases", "to filter"];

async function hostServer(PORT) {
    let connections = [];

console.log('Port:', PORT);

const app = express()
.get('/', (_, r) => r.sendFile(require('path').join(process.cwd(), '/web/index.html')))
.get('/styles.css', (_, r) => r.sendFile(require('path').join(process.cwd(), '/web/styles.css')))
.listen(PORT);
const wss = new Server({ server: app });


wss.on('connection', ws => {


    const handlers = {
        auth: s => {
            if (connections.some(x => x.username === s.username)) {
                ws.send(JSON.stringify(["refusal", 'Username already taken.']));
                return ws.close();
            }
            if (filter.some(x => s.username.toLowerCase().includes(x))) {
                ws.send(JSON.stringify(['refusal', 'No profanity allowed!']));
                return ws.close();
            }
            username = s.username;
            connections.find(x => x.id === id).username = username;
            ws.send(JSON.stringify(['id', id, serverVersion]));
            console.log(`[SERVER: ${PORT}] Connection: ${username} #${id}`);
            connections.filter(x => x.id !== id).forEach(x => x.ws.send(JSON.stringify(['join', username])))
        },
        msg: s => {
            //console.log(s);
            if (filter.some(x => s.msg.toLowerCase().includes(x))) {
                ws.send(JSON.stringify(['refusal', 'No profanity allowed!']));
                return ws.close();
            }
            if (!s.msg.trim()) {
                ws.send(JSON.stringify(["refusal", 'No Empty Messages allowed!']));
                return ws.close();
            }
            if (s.id === id)
                connections
                    .filter(x => x.id !== id)
                    .forEach(x => x.ws.send(JSON.stringify(['message', username, s.msg])))
        },
    };
    let id = connections.length;
    while (connections.some(x => x.id === id)) id++;
    let username;
    connections.push({ ws, id });
    ws.onmessage = s => {
        let d;
        try {
            d = JSON.parse(s.data);
            handlers[d[0]] && handlers[d[0]](...d.slice(1));
        } catch {}
    };
    ws.onclose = () => {
        connections = connections.filter(x => x.id !== id);
        connections.forEach(x => x.ws.send(JSON.stringify(['disconnect', username])));
        console.log(`[SERVER: ${PORT}] Disconnection: ${username} #${id}`)
    };
});
}

ports.map(x => {
    hostServer(x);
});