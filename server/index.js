const { Server } = require('ws');
const express = require('express');

// set the ports you want to host on if you need multiple servers
const ports = [90]

// set the words you want to filter from usernames and messages
const filter = ["filtertest", "yomama"];

async function hostServer(PORT) {
    let connections = [];

console.log('Port:', PORT);

const app = express()
.use((_, r) => r.send('go away'))
.listen(PORT);
const wss = new Server({ server: app });
wss.on('connection', ws => {


    const handlers = {
        auth: s => {
            if (connections.some(x => x.username === s.username)) return ws.send(JSON.stringify(["refusal", 'Username already taken.']));
            if (filter.some(x => s.username.toLowerCase().includes(x))) return ws.send(JSON.stringify(['refusal', 'No profanity allowed!']));
            username = s.username;
            connections.find(x => x.id === id).username = username;
            ip = s.ip;
            ws.send(JSON.stringify(['id', id]));
            console.log(`[SERVER: ${PORT}] Connection: ${username} #${id}`);
            connections.filter(x => x.id !== id).forEach(x => x.ws.send(JSON.stringify(['join', username])))
        },
        msg: s => {
            //console.log(s);
            if (filter.some(x => s.msg.toLowerCase().includes(x))) return ws.send(JSON.stringify(['refusal', 'No profanity allowed!']));
            if (!s.msg.trim()) return ws.send(JSON.stringify(['refusal', 'No empty messages allowed!']));
            if (s.id === id)
                connections
                    .filter(x => x.id !== id)
                    .forEach(x => x.ws.send(JSON.stringify(['message', username, s.msg])))
        },
    };
    let id = connections.length;
    while (connections.some(x => x.id === id)) id++;
    let username;
    let ip;
    connections.push({ ws, id });
    ws.onmessage = s => {
        const d = JSON.parse(s.data);
        handlers[d[0]] && handlers[d[0]](...d.slice(1));
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