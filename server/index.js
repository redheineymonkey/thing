import { handler } from '../build/handler.js';
import { writeFileSync } from 'fs';
import { Server } from 'socket.io';

import express from 'express';
import http from 'http';

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = 5173;

app.use(handler);

let data = []

let timeLimit = 30;
let timeLeft = 30;

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

    if (obj != {}){
        console.log(obj)
        console.log(maxKey, ": ", maxValue)
        data.push(`${JSON.stringify(obj)} | ${maxKey}: ${maxValue}`)
    }
    return maxKey;
}
async function endRound() {
    const result = chwinner || countVotes(answers);
    answers = [];
    io.emit('end', result);
    chwinner = null
}
async function broadcastProgress() {
    if (timeLeft <= 0 || answers.length >= io.sockets.sockets.size - 1 && answers.length < 0) {
        currentQuestion = '';
        await endRound();
    } else {
        setTimeout(broadcastProgress, 1000);
    }
    io.emit('progress', timeLeft--, answers.length);
}

io.on('connection', socket => {
    console.log(io.sockets.sockets.size - 1, "users connected");
    if (currentQuestion) {
        socket.emit('question', currentQuestion);
    }
    socket.on('ask', (question) => {
        answers = [];
        timeLeft = timeLimit;
        currentQuestion = question;
        io.emit('question', question);
        broadcastProgress()
    });

    socket.on('submit', answer => {
        answers.push(answer);
    });
});

const instructions = [
    '\x1b[31m t {num}: \x1b[34m change time \n',
    '\x1b[31m i: \x1b[34m instructions \n',
    '\x1b[31m end: \x1b[34m end \n',
    '\x1b[31m p: \x1b[34m peek \n',
    '\x1b[31m c: \x1b[34m clear console \n',
    '\x1b[31m e: \x1b[34m exit \n \x1b[37m',
].join('');

console.log(instructions);

process.stdin.setEncoding('utf8');
process.stdin.on('data', function (text) {
    if (text.trim().startsWith('t ')) {
        console.log('prev: ', timeLimit);
        timeLimit = parseInt(text.trim().slice(2));
    }
    if (text.trim() === 'i') {
        console.log(instructions);
    }
    if (text.trim() === 'end') {
        timeLeft = 0;
    }
    if (text.trim() === 'p') {
        console.clear();
        countVotes(answers);
    }
    if (text.trim() === 'c') {
        console.clear();
    }
    if (text.trim() === 'e') {
        process.exit();
    }
    if (text.trim().startsWith('cheat ')) {
        chwinner = text.trim().slice(6);
    }
});

process.on('exit', () => {
    writeFileSync('./server/db', data.join('\n'));
    console.log(data.join('\n'));
});

server.listen(port);
