const { Server } = require('ws');
const express = require('express');
const config = require("./secureconfig.json");
const prompt = require("prompt-sync")();

// set the ports you want to host on if you need multiple servers
const port = 70;
const serverVersion = "s25032021 - Based on 25032021";
console.log(`CLIChat Secure Server ${serverVersion}`);

// set the words you want to filter from usernames and messages
const filter = ["words or phrases", "to filter"];

async function hostServer(PORT) {
    let connections = [];
    let tokens = {
        "SOME_TOKEN": {inuse: false, count: 0}
    };

console.log('Port:', PORT);

const app = express()
.use((_, r) => r.send('go away'))
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

            if (!s.token || !tokens[s.token] || (tokens[s.token].inuse == true && config['1UPT'] == true)) {
                ws.send(JSON.stringify(['refusal', 'Token refused']));
                return ws.close();
            }

            token = s.token;
            tokens[s.token].count++;
            config['1UPT'] ? tokens[token].inuse = true : null;
            username = s.username;
            connections.find(x => x.id === id).username = username;
            ip = s.ip;
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
    let ip;
    let token;
    connections.push({ ws, id, token });
    ws.onmessage = s => {
        let d;
        try {
            d = JSON.parse(s.data);
            handlers[d[0]] && handlers[d[0]](...d.slice(1));
        } catch {}
    };
    ws.onclose = () => {
        if (!token) return;

        connections = connections.filter(x => x.id !== id);
        connections.forEach(x => x.ws.send(JSON.stringify(['disconnect', username])));
        tokens[token].count--;
        config['1UPT'] ? tokens[token].inuse = false : null;
        tokens[token].count == 0 ? tokens[token].inuse = false : null;
        console.log(`[SERVER: ${PORT}] Disconnection: ${username} #${id}`)
    };
});

    /*while (true) {
        let tok = prompt("New token: ");

        if (tok.startsWith('seetokendata:')) {
            let view = tok.split(" ").slice(1).join(" ");
            config['1UPT'] ? console.log(`In use: ${tokens[view].inuse}`) : console.log(`UserCount of token: ${tokens[view].count}`);
            continue;
        }

        if (tok.startsWith(`tokenlist`)) {
            console.log("\n");

            for (const [key, value] of Object.entries(tokens)) {
                console.log(`${key}: ${value.inuse}, ${value.count}`);
            }


            console.log("\n");
            continue;
        }

        tokens[tok] = {
            inuse: false,
            count: 0
        }

        console.log(`Token pushed. [1UPT is ${config['1UPT'] ? "Enabled" : "Disabled"}]`);
    }*/
}

hostServer(port);