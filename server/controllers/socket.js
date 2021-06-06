
module.exports = socketModule = (server) => {

    const io = require('socket.io')(server,
        {
            cors: {
                origin: '*',
            }
        }
    );

    chatUserList = [];
    connectionList = [];
    const socketConnection = () => {
        io.on('connection', (socket) => {

            socket.on('userLoggedIn', (user) => {
                const index = chatUserList.findIndex(el => el._id == user._id);
                if (index != -1) {
                    io.emit('socketForLoggedInUser', chatUserList[index].socketId);
                } else {
                    chatUserList.push({ socketId: socket.id, _id: user._id, name: user.userName });
                    io.emit('socketForLoggedInUser', socket.id);
                }
            });

            socket.on('create', (data) => {
                const room = getRoomId(data.room);
                room ?  '' : connectionList.push(data.room);
                const roomId = room ?  room : data.room;
                socket.join(roomId);
                const index = chatUserList.findIndex(el => el._id == data.chatingUser._id);
                if (index != -1) {
                    socket.broadcast.to(chatUserList[index].socketId);
                }
            });

            socket.on('message', (data) => {
                const room = getRoomId(data.room);
                socket.broadcast.to(room).emit('message', data);
            });

            const getRoomId = (roomId) => {
                const room = connectionList.filter(item => {
                    return item.split('-').every(el => roomId.includes(el));
                });
                return room[0];
            }
        });
    }
    socketConnection();
}


