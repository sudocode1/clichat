const { Server } = require('ws');
const express = require('express');
const config = require("./secureconfig.json");
const prompt = require("prompt-sync")();
const fs = require('fs');

let temporaryIds = {

};

// set the port you want to host on
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
/*.use((_, r) => r.send('go away'))/*;*/

/*app*/.get('/:id', (req, res) => {
    if (isNaN(req.params.id)) return;

    console.log(temporaryIds);
    console.log(req.params.id);
    console.log(temporaryIds[req.params.id]);
    if (!temporaryIds[req.params.id].inUse) {
        res.send('shut up');
    } else {
        res.send(`<!DOCTYPE html><style>h1,h2{font-family:Arial;}</style><h1>authorization</h1><h2>your token is ${temporaryIds[req.params.id].token}</h2>`);
    }
})/*;*/

/*app*/.listen(PORT);

const wss = new Server({ server: app });
wss.on('connection', ws => {


    const handlers = {
        auth: async s => {
            if (connections.some(x => x.username === s.username)) {
                ws.send(JSON.stringify(["refusal", 'Username already taken.']));
                return ws.close();
            }
            if (filter.some(x => s.username.toLowerCase().includes(x))) {
                ws.send(JSON.stringify(['refusal', 'No profanity allowed!']));
                return ws.close();
            }

            if (s.username.length > 15) {
                ws.send(JSON.stringify(['refusal', 'username is too long']));
                ws.close();
            }

            if (!s.token || !tokens[s.token] || (tokens[s.token].inuse == true && config['1UPT'] == true)) {
                ws.send(JSON.stringify(['refusal', 'Token refused']));
                return ws.close();
            }

            token = s.token;
            tokens[s.token].count++;
            config['1UPT'] ? tokens[token].inuse = true : null;
            username = s.username;
            tempId = (Math.round(Math.random() * 1000000) * Math.round(Math.random() * 1000000)).toString();
            temporaryToken = "";
            for(i=0;i<100;i++) {
                let array = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z",".",1,2,3,4,5,6,7,8,9,0];
                let char = array[Math.floor(Math.random() * array.length)];
                let caseType = Math.round(Math.random());

                let result;

                if (caseType == 0 && typeof(array) == `string`) {
                    result = char.toLowerCase();
                } else if (caseType == 1 && typeof(array) == `string`) {
                    result = char.toUpperCase();
                } else {
                    result = char;
                }

                temporaryToken += result;
            };
            passedAuth = false;
            temporaryIds[tempId] = {
                inUse: true,
                token: temporaryToken
            };

            console.log(temporaryIds[tempId]);
            // app.get(`/${tempId}`, function(req,res) {
            //     res.send(`<!DOCTYPE html><h1>authorization</h1><h2>your token is ${temporaryToken}</h2>`);
            // });

            console.log([username, tempId]);
            ws.send(JSON.stringify(['authmsg', `SERVERIPHERE/${tempId}`]));

            let match = false;
            console.log("promise start");
            await new Promise(r => {
                
                console.log("promise in progress");
                ws.on('message', async d => {
                    console.log(d, JSON.stringify(['tokenauth', temporaryToken]));
                    match = d == JSON.stringify(['tokenauth', temporaryToken]);
                    r();
                });

                
            });
            console.log("promise end");

            console.log("match");
            console.log(match);
            if (match) {
                console.log('yes');
                temporaryIds[tempId] = {
                    inUse: false,
                    token: 'why'    
                }
                passedAuth = true;
            } else {
                console.log('no');
                ws.send(JSON.stringify(['refusal', 'refused']));
                temporaryIds[tempId] = {
                    inUse: false,
                    token: 'why'    
                }
                ws.close();
            }
           
            connections.find(x => x.id === id).username = username;
            ws.send(JSON.stringify(['id', id, serverVersion]));
            console.log(`[SERVER: ${PORT}] Connection: ${username} #${id}`);
            connections.filter(x => x.id !== id).forEach(x => x.ws.send(JSON.stringify(['join', username])))
        },
        msg: s => {
            if (passedAuth == false) return;

            if (s.msg.length > 200) {
                return ws.send(JSON.stringify(['refusal', `message is too long [${s.msg.length}/200]`]));
            }
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
    let token;
    let tempId;
    let temporaryToken;
    connections.push({ ws, id, token });
    ws.onmessage = s => {
        //console.log(s);
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