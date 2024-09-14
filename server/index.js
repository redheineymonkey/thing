import { handler } from '../build/handler.js';
import { writeFileSync } from 'fs';
import { Server } from 'socket.io';

import express from 'express';
import http from 'http';

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const dashboard = io.of('/admin');
const port = 8080;

app.use(handler);

let data = []

let timeLimit = 30;
let timeLeft = 0;

let answers = [];
let currentQuestion = '';

let chwinner = null;
function countVotes(array) {
    const obj = {};

    array.forEach(item => {
        obj[item] = (obj[item] || 0) + 1;
    });

    let maxKey = null;
    let maxValue = Number.MIN_SAFE_INTEGER;

    for (const [key, value] of Object.entries(obj)) {
        if (Number.isInteger(value) && value > maxValue) {
            maxKey = key;
            maxValue = value;
        }
    }
    console.log(obj)
    console.log(maxKey, ": ", maxValue)
    data.push(`${currentQuestion}: {${JSON.stringify(obj)} | ${maxKey}: ${maxValue}}`)

    return maxKey;
}
function end() {
    const winner = countVotes(answers);
    const result = chwinner || winner;
    dashboard.emit('end', result);
    answers = [];
    chwinner = null
}
function progress() {
    if (!currentQuestion) return
    if (io.sockets.sockets.size == answers.length && answers.length > 0) {
        console.log("Equal sockets and answers and more than 1 answer");
        end()
        return
    } else if (timeLeft <= 0.5 && answers.length > 0) {
        console.log("time out and more than 1 answer");
        end()
        return
    }
    if (timeLeft <= 0.5 && answers.length == 0) {
        console.log("time ran out");
        timeLeft = timeLimit
    }
    setTimeout(() => {
        progress();

    }, 100);

    dashboard.emit('progress', timeLeft -= 0.1, answers.length);
}
dashboard.on('connection', socket => {
    socket.on('ask', (question) => {
        answers = [];
        timeLeft = timeLimit;
        currentQuestion = question;
        io.emit('question', question);
        progress()

    });
});
io.on('connection', socket => {
    console.log(io.sockets.sockets.size, "users connected");
    if (currentQuestion) {
        socket.emit('question', currentQuestion);
    }
    socket.on('submit', answer => {
        answers.push(answer);
    });
});

const instructions = [
    '\x1b[31m t {num}: \x1b[34m change time\n',
    '\x1b[31m tl {num}: \x1b[34m change time limit\n',
    '\x1b[31m i: \x1b[34m instructions \n',
    '\x1b[31m end: \x1b[34m sets time left to 0 \n',
    '\x1b[31m peek: \x1b[34m peek \n',
    '\x1b[31m " ": \x1b[34m clear console \n',
    '\x1b[31m e: \x1b[34m exit \n \x1b[37m',
    'ch '
].join('');

console.log(instructions);

process.stdin.setEncoding('utf8');
process.stdin.on('data', function (text) {
    if (text.trim().startsWith('t ')) {
        timeLeft = parseInt(text.trim().slice(2));
    }
    if (text.trim().startsWith('tl ')) {
        console.log('prev: ', timeLimit);
        timeLimit = parseInt(text.trim().slice(2));
    }
    if (text.trim() === 'i') {
        console.log(instructions);
    }
    if (text.trim() === 'end') {
        timeLeft = 0;
    }
    if (text.trim() === 'peek') {
        console.clear();
        countVotes(answers);
    }
    if (text.trim() === '') {
        console.clear();
    }
    if (text.trim() === 'e') {
        process.exit();
    }
    if (text.trim().startsWith('ch ')) {
        chwinner = text.trim().slice(3);
    }
});

process.on('exit', () => {
    writeFileSync('./server/db', data.join('\n'));
    console.log(data.join('\n'));
});

server.listen(port, () => { console.log(port) });
