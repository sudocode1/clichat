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
function historyLog() {
    process.stdout.write('\u001b[3J\u001b[2J\u001b[1J');
    console.clear();
    let hist = "";

    history.forEach(x => {
        hist += `\n${x}`;
    });

    console.log(hist);
}

clear();
const wsHandlers = {
    message: (username, content) => {
        history.push(`${username}: ${content}`);
        historyLog();
    },
    disconnect: username => {
        if (username === null) null;
        else {
            history.push(`${username} left the room.`);
            historyLog();
        };
    },
    join: username => {
        history.push(`${username} joined the room.`);
        historyLog();
    },
    id: (x, serverVer) => {
        history.push("Server Version: " + serverVer);
        history.push("You joined the room.")
        id = x;
        historyLog();
    },
    refusal: x => {
        history.push(`REFUSAL: ${x}`);
        historyLog();
        process.exit();
    }
};

let ip;
let id;

if (!username) (history.push("No username entered"), historyLog(), process.exit());

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