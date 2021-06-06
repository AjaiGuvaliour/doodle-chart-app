const jwt = require('jsonwebtoken');
const Message = require('../modals/Message');

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
                room ? '' : connectionList.push(data.room);
                const roomId = room ? room : data.room;
                socket.join(roomId);
                const index = chatUserList.findIndex(el => el._id == data.chatingUser._id);
                if (index != -1) {
                    socket.broadcast.to(chatUserList[index].socketId);
                }
            });

            socket.on('message', (data) => {
                const room = getRoomId(data.room);
                saveDataToDB(data);
                socket.broadcast.to(room).emit('message', data);
            });

            socket.on('logout', (user) => {
                const index = chatUserList.findIndex(el => el._id == user._id);
                if (index != -1) {
                    chatUserList.splice(index, -1);
                }
            });

            const getRoomId = (roomId) => {
                const room = connectionList.filter(item => {
                    return item.split('-').every(el => roomId.includes(el));
                });
                return room[0];
            }

            const saveDataToDB = (data) => {
                const chatData = {
                    room: data.room,
                    message: data.message,
                    from: data.from,
                    to: data.to,
                    sender: data.sender,
                    reciver: data.reciver,
                    active: true
                }
                jwt.verify(data.token, 'doodleCloudKey', async (err, authData) => {
                    if (err) {
                    } else {
                        let msgModel = new Message(chatData);
                        await msgModel.save(
                            (err) => {
                                if (err) {
                                    io.emit('saveDataToDB', {
                                        success: false
                                    });
                                } else {
                                    io.emit('saveDataToDB', {
                                        success: true,
                                        sender: data.sender,
                                        reciver: data.reciver
                                    });
                                }
                            }
                        );
                    }
                })
            }
        });
    }
    socketConnection();
}


