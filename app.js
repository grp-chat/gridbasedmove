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
    [1,0,0,1,0,0,0,1,0,0,0,1,0,0,1,0,0,0,1,0,1,0,0,0,1,0,0,0,1,1,0,1,0,0,0,1,0,1],
    [1,0,0,1,0,0,0,1,0,0,0,1,0,0,1,0,0,0,1,0,1,0,0,0,1,0,0,0,1,1,0,1,0,0,0,1,0,1],
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


        this.p1 = { x: 1, y: 7, lable: 2, id: "TCR", steps: 30 };


        this.p2 = { x: 2, y: 2, lable: 3, id: "LXR", steps: 3000 };
        this.p3 = { x: 1, y: 1, lable: 4, id: "LK", steps: 3000 };
        this.p4 = { x: 2, y: 3, lable: 5, id: "JHA", steps: 3000 };

        this.p5 = { x: 1, y: 14, lable: 6, id: "JV", steps: 3000 };
        this.p6 = { x: 2, y: 14, lable: 7, id: "JL", steps: 3000 };
        this.p7 = { x: 2, y: 13, lable: 8, id: "SZF", steps: 3000 };
        this.p8 = { x: 2, y: 12, lable: 9, id: "LEN", steps: 3000 };
        
        this.playersArr = [this.p1, this.p2, this.p3, this.p4, this.p5, this.p6, this.p7, this.p8];

        this.playersArr.forEach((player) => {
            this.#startingPoint(player);
        });

        

        this.moveSwitch = 0;
        

    }
    #startingPoint(plyrSlot) {
        this.matrix[plyrSlot.y][plyrSlot.x] = plyrSlot.lable;
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
                plyrSlot.steps--;
            }

        } else if (keyCode === 39) {
            if (this.#isValidMove(plyrSlot, 1, 0)) {
                this.#updPosition(39, plyrSlot);
                plyrSlot.steps--;
            }

        } else if (keyCode === 38) {
            if (this.#isValidMove(plyrSlot, 0, -1)) {
                this.#updPosition(38, plyrSlot);
                plyrSlot.steps--;
            }

        } else if (keyCode === 40) {
            if (this.#isValidMove(plyrSlot, 0, 1)) {
                this.#updPosition(40, plyrSlot);
                plyrSlot.steps--;
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

    teleportMeOut() {
        this.matrix[this.p1.y][this.p1.x] = 0;
        this.matrix[7][4] = this.p1.lable;
        this.p1.y = 7;
        this.p1.x = 4;
    }
    teleportMeIn() {
        this.matrix[this.p1.y][this.p1.x] = 0;
        this.matrix[7][1] = this.p1.lable;
        this.p1.y = 7;
        this.p1.x = 1;
    }

}

const gridSystem = new GridSystem(gridMatrix);

var mindControlMode = false;
var mindControlledStudent = "";


io.sockets.on('connection', function (sock) {

    sock.on('newuser', (data) => {

        sock.id = data;
        var playersArr = gridSystem.playersArr;

        gridSystem.playersArr.forEach((player) => {
            if (player.id === sock.id) {
                io.emit('sendMatrix', { gridMatrix, playersArr });
            }
            
        });

        sock.on('keyPress', function (data) {
            if (mindControlMode === false) {
                gridSystem.playersArr.forEach((player, index) => {
                    if (player.id === sock.id && player.steps > 0) {
                        gridSystem.movePlayer(data, gridSystem.playersArr[index]);
                        //gridSystem.movePlayer(data, gridSystem.playersArr[2]);
                        io.emit('sendMatrix', { gridMatrix, playersArr });
                    }
                });
            } else if (mindControlMode === true && sock.id === "TCR") {
                gridSystem.playersArr.forEach((player, index) => {
                    if (player.id === mindControlledStudent && player.steps > 0) {
                        gridSystem.movePlayer(data, gridSystem.playersArr[index]);
                        //gridSystem.movePlayer(data, gridSystem.playersArr[2]);
                        io.emit('sendMatrix', { gridMatrix, playersArr });
                    }
                });
            }
            

        });

    });

    /* sock.on('disconnect', function() {
        delete SOCKET_LIST[sock.id];
        Player.onDisconnect(sock);
    }); */

    sock.on('teleportMeOut', () => {
        gridSystem.teleportMeOut();
    });
    sock.on('teleportMeIn', () => {
        gridSystem.teleportMeIn();
    });

    sock.on('addSteps', (data) => {
        var playersArr = gridSystem.playersArr;
        gridSystem.playersArr.forEach((player) => {
            if (player.id === data.studentId) {
                var convertToNum = Number(data.getNum)
                player.steps += convertToNum;
                io.emit('sendMatrix', { gridMatrix, playersArr });
            }
        });
    });

    sock.on('mindControl', (data) => {
        mindControlledStudent = data;
        mindControlMode = true;
    });
    sock.on('mindControlOff', () => {
        mindControlledStudent = "";
        mindControlMode = false;
    });

    sock.on('chat-to-server', (data) => {
        io.emit('chat-to-clients', data);
    });

});


setInterval(function () {
    var playersArr = gridSystem.playersArr;
    io.emit('sendMatrix', { gridMatrix, playersArr });

}, 2000);