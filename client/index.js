const WebSocket = require('ws');
const request = require("request");
const prompt = require("prompt-sync")();

let username = prompt("username: ");
let connection = prompt("server to connect to: ");


process.stdin.resume();

const ws = new WebSocket(`ws://${connection}`);

const history = [];
const clear = () => {
    process.stdout.write('\u001b[3J\u001b[2J\u001b[1J');
    console.clear();
    for (const s of history) log(s, false, false);
};
const log = (s, n = true, c = true) => [c ? clear : () => {}, x => process.stdout.write(x.trim() + '\n'), n ? x => history.push(x) : () => {}].forEach(f => f(n ? `[${new Date().toLocaleString()}] ${s}` : s));

clear();
const wsHandlers = {
    message: (username, content) => {
        log(`${username}: ${content}`)
    },
    disconnect: username => {
        if (username === null) null;
        else log(`${username} left the room\n`);
    },
    join: username => {
        log(`${username} joined the room.\n`);
    },
    id: (x, serverVer) => {
        history.push("Server Version: " + serverVer);
        id = x;
        log('You joined the room.\n');
    },
    refusal: x => {
        log(x);
        process.exit();
    }
};

let ip;
let id;

if (!username) (log("No username entered"), process.exit());

ws.onopen = async () => {
    ip = await new Promise((a, b) => request(`https://myexternalip.com/raw`, (err, _, body) => err ? b(err) : a(body)));
    ws.send(JSON.stringify(['auth', { ip, username }]));
    process.stdin.on('data', x => {
        const msg = `${x}`;
        if (msg === "exit") return rl.close();
        ws.send(JSON.stringify(['msg', { id, msg }]));
        log(`You: ${x}`);
        clear();
    });
};
ws.onmessage = s => {
    const d = JSON.parse(s.data);
    wsHandlers[d[0]] && wsHandlers[d[0]](...d.slice(1));
};