const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// In-memory ranking store
const players = new Map(); // socketId -> { name, score, status, joinedAt }

function getRanking() {
    return Array.from(players.values())
        .sort((a, b) => b.score - a.score)
        .map((p, i) => ({ ...p, position: i + 1 }));
}

app.prepare().then(() => {
    const httpServer = createServer((req, res) => {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
    });

    const io = new Server(httpServer, {
        cors: { origin: '*' },
    });

    io.on('connection', (socket) => {
        console.log(`[WS] Player connected: ${socket.id}`);

        // Player joins with name
        socket.on('player:join', (name) => {
            players.set(socket.id, {
                id: socket.id,
                name: name || 'Jogador',
                score: 0,
                status: 'playing',
                joinedAt: Date.now(),
            });
            console.log(`[WS] ${name} joined the game`);
            io.emit('ranking:update', getRanking());
        });

        // Player updates score
        socket.on('player:score', (score) => {
            const player = players.get(socket.id);
            if (player) {
                player.score = score;
                io.emit('ranking:update', getRanking());
            }
        });

        // Player finishes the game (only update status, score already synced via player:score)
        socket.on('player:finish', () => {
            const player = players.get(socket.id);
            if (player) {
                player.status = 'finished';
                io.emit('ranking:update', getRanking());
            }
        });

        // Player disconnects
        socket.on('disconnect', () => {
            const player = players.get(socket.id);
            if (player) {
                console.log(`[WS] ${player.name} disconnected`);
            }
            players.delete(socket.id);
            io.emit('ranking:update', getRanking());
        });
    });

    httpServer.listen(port, () => {
        console.log(`> EcoPlay running on http://${hostname}:${port}`);
    });
});
