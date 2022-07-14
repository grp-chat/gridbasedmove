const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const PORT = process.env.PORT || 3000;

const app = express();

const clientPath = `${__dirname}/client`;
console.log(`Serving static files from path ${clientPath}`);

app.use(express.static(clientPath));
const server = http.createServer(app);
const io = socketio(server);

server.listen(PORT);
console.log("Server listening at " + PORT);

//------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------

const gridMatrix = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0,0,0,1],
    [1,0,0,1,0,1,0,0,0,1,0,1,0,0,1,1,0,0,1,0,1,0,1,0,1,1,0,1,1,0,0,1,0,1,0,1,0,1],
    [1,0,0,1,0,0,0,1,1,0,0,1,0,1,1,1,1,0,1,0,1,0,1,0,1,0,0,1,0,1,0,1,0,1,0,1,0,1],
    [1,0,1,1,0,1,0,1,0,0,1,1,0,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,0,1,0,1,0,1,0,1,0,1],
    [1,0,0,0,0,0,0,1,0,1,0,1,0,1,1,0,1,0,0,0,1,0,1,0,1,0,1,0,0,1,0,1,0,1,0,1,0,1],
    [1,1,1,1,0,1,0,1,0,1,0,0,0,1,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,0,0,1,0,1,0,1,0,1],
    [1,1,1,1,0,0,0,1,0,0,0,1,0,0,1,0,0,0,1,0,1,0,0,0,1,0,0,0,1,1,0,1,0,0,0,1,0,1],
    [1,1,1,1,0,0,0,1,0,0,0,1,0,0,1,0,0,0,1,0,1,0,0,0,1,0,0,0,1,1,0,1,0,0,0,1,0,1],
    [1,1,1,1,0,1,0,1,0,1,0,0,0,1,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,0,0,1,0,1,0,1,0,1],
    [1,0,0,0,0,0,0,1,0,1,0,1,0,1,1,0,1,0,0,0,1,0,1,0,1,0,1,0,0,1,0,1,0,1,0,1,0,1],
    [1,0,1,1,0,1,0,1,0,0,1,1,0,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,0,1,0,1,0,1,0,1,0,1],
    [1,0,0,1,0,0,0,1,1,0,0,1,0,1,1,1,1,0,1,0,1,0,1,0,1,0,0,1,0,1,0,1,0,1,0,1,0,1],
    [1,0,0,1,0,1,0,0,0,1,0,1,0,0,1,1,0,0,1,0,1,0,1,0,1,1,0,1,1,0,0,1,0,1,0,1,0,1],
    [1,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    ];



class GridSystem {
    constructor(matrix) {
        this.matrix = matrix;
        this.cellSize = 40;
        this.padding = 2;


        this.p1 = { x: 1, y: 1, color: "orange", lable: 2, id: "TCR" };
        this.matrix[this.p1.y][this.p1.x] = this.p1.lable;
        this.p2 = { x: 1, y: 2, color: "green", lable: 3, id: "LXR" };
        this.matrix[this.p2.y][this.p2.x] = this.p2.lable;
        this.p3 = { x: 1, y: 3, color: "purple", lable: 4, id: "LK" };
        this.matrix[this.p3.y][this.p3.x] = this.p3.lable;

        this.moveSwitch = 0;
        this.playersArr = [this.p1, this.p2, this.p3];

    }

    #isValidMove(plyrSlot, x, y) {
        if (this.matrix[plyrSlot.y + y][plyrSlot.x + x] === 0) {
            return true;
        }
        return false;
    }

    movePlayer(keyCode, plyrSlot) {

        if (keyCode === 37) {
            if (this.#isValidMove(plyrSlot, -1, 0)) {
                this.#updPosition(37, plyrSlot);
            }

        } else if (keyCode === 39) {
            if (this.#isValidMove(plyrSlot, 1, 0)) {
                this.#updPosition(39, plyrSlot);
            }

        } else if (keyCode === 38) {
            if (this.#isValidMove(plyrSlot, 0, -1)) {
                this.#updPosition(38, plyrSlot);
            }

        } else if (keyCode === 40) {
            if (this.#isValidMove(plyrSlot, 0, 1)) {
                this.#updPosition(40, plyrSlot);
            }

        }
    }

    #updPosition(keyCode, plyrSlot) {
        if (keyCode === 37) {
            this.matrix[plyrSlot.y][plyrSlot.x] = 0;
            this.matrix[plyrSlot.y][plyrSlot.x - 1] = plyrSlot.lable;
            plyrSlot.x--;
        } else if (keyCode === 39) {
            this.matrix[plyrSlot.y][plyrSlot.x] = 0;
            this.matrix[plyrSlot.y][plyrSlot.x + 1] = plyrSlot.lable;
            plyrSlot.x++;
        } else if (keyCode === 38) {
            this.matrix[plyrSlot.y][plyrSlot.x] = 0;
            this.matrix[plyrSlot.y - 1][plyrSlot.x] = plyrSlot.lable;
            plyrSlot.y--;
        } else if (keyCode === 40) {
            this.matrix[plyrSlot.y][plyrSlot.x] = 0;
            this.matrix[plyrSlot.y + 1][plyrSlot.x] = plyrSlot.lable;
            plyrSlot.y++;
        }

    }

}

const gridSystem = new GridSystem(gridMatrix);


io.sockets.on('connection', function (sock) {

    sock.on('newuser', (data) => {

        sock.id = data;
        io.emit('sendMatrix', gridMatrix);
        sock.on('keyPress', function (data) {
            gridSystem.playersArr.forEach((player, index) => {
                if (player.id === sock.id) {
                    gridSystem.movePlayer(data, gridSystem.playersArr[index]);
                    io.emit('sendMatrix', gridMatrix);
                }
            });
            
            
        });

        //io.emit('sendMatrix', gridMatrix);

    });

    /* sock.id = Math.random();
    SOCKET_LIST[sock.id] = sock;
    Player.onConnect(sock); */
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~LISTEN FROM CLIENT - CONNECTION~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    /* sock.on('disconnect', function() {
        delete SOCKET_LIST[sock.id];
        Player.onDisconnect(sock);
    }); */
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~LISTEN FROM CLIENT - CONNECTION ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~




    /* sock.on('chat-to-server', (data) => {
        io.emit('chat-to-clients', data);
    }); */


});


/* setInterval(function () {
    
    io.emit('sendMatrix', gridMatrix);

}, 1000 / 25); */