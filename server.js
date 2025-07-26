const cloudinary = require("./src/lib/cloudinary.js");

const prisma = require("./src/lib/prisma");
let next = require("next");
let Server = require("socket.io").Server;
let createServer = require("http").createServer;

let app = next({ dev: process.env.NODE_ENV !== "production" });
let handler = app.getRequestHandler();

app.prepare().then(() => {
    let server = createServer(handler);

    let io = new Server(server, {
        cors: {
            origin:  process.env.NEXTAUTH_URL ||  "http://localhost:3000",
            credentials: true
        }
    });

    let onlineUsers = {};

    io.on("connection", async (socket) => {

        let userId = socket.handshake?.auth?.userId;
        onlineUsers[userId] = socket.id;

        let OnlineUsers = Object.keys(onlineUsers);
        io.emit("getOnlines", OnlineUsers);




        if (userId) {
            await Promise.all([
                prisma.message.updateMany({
                    where: { receiverId: userId, status: "sent" },
                    data: {
                        status: "delivered",
                        deliveredAt: new Date()
                    }
                }),
                prisma.messageStatus.updateMany({
                    where: {
                        userId: userId
                    },
                    data: {
                        deliveredAt: new Date()
                    }
                })])


            socket.broadcast.emit("changeStatus-all", userId)
        }


        socket.on("join-users", (groupObj, ack) => {
            for (let key in groupObj){
                groupObj[key].forEach(obj => {
                    let userSocket = io.sockets.sockets.get(onlineUsers[obj.userId])
                    if (userSocket){

                        userSocket.join(key)
                    }
                });
            }
            ack({ success: true })
        })
        socket.on("join-to-group", (groupId, uerIds) => {

            uerIds.forEach(user => {
                let userSocket = io.sockets.sockets.get(onlineUsers[user])
             
                if (userSocket) {
                    userSocket.join(groupId)
                }

            });
            socket.to(groupId).emit("fetch-groups")
        })
        socket.on("send-groupMessage", async (data) => {
            try {
                let users = await prisma.groupUser.findMany({
                    where: {
                        groupId: data.groupId,
                        userId: { not: data.senderId }
                    },
                    select: {
                        userId: true
                    }
                })

                let newMessages = await prisma.groupMessages.create({
                    data: {
                        group: {
                            connect: {
                                id: data.groupId
                            }
                        },
                        sender: {
                            connect: {
                                id: data.senderId
                            }
                        },
                        content: data.content,
                        status: {
                            createMany: {
                                data: users.map((user) => ({
                                    userId : user.userId,
                                    status : "sent",
                                deliveredAt : null,
                                 readAt : null
                                }))
                            },

                        }
                    },
                    include: {
                        status: true
                    }
                })


                if (newMessages) {

                    io.to(newMessages.groupId).emit("receiveMessages", newMessages, data.uniqueId)
                }
            } catch (error) {
                console.log(error.message);

            }
        })
        socket.on("delivered-groupMessage", async (message, groupId) => {
            
            if (message.deliveredAt !== null && message.id) {

                await prisma.messageStatus.update({
                    where: {
                        id: message?.id
                    },
                    data: {
                        deliveredAt: message.deliveredAt,
                        status : "delivered"
                    }
                })
                io.to(groupId).emit("groupDelivered-success", message)
            }
        })
        socket.on("read-groupMessage",async (message,groupId)=>{

            if (message.deliveredAt !== null && message.readAt !== null && message.id) {

                await prisma.messageStatus.update({
                    where: {
                        id: message?.id
                    },
                    data: {
                        deliveredAt: message.deliveredAt,
                        readAt : message.readAt,
                        status : "readed"
                    }
                })
                io.to(groupId).emit("groupDelivered-success", message)
            }
        })

        socket.on("Groupmessage-readed", async (payload) => {
            try {
                let { groupId, userId } = payload

                let messages = await prisma.groupMessages.findMany({
                    where: {
                        groupId
                    },
                    select : {
                        id : true
                    }
                })
                let msgIds = messages.map((msg) => msg.id)
           

                let updated = await prisma.messageStatus.updateMany({
                    where: {
                        groupMessage: { in: msgIds },
                        userId: userId,
                        readAt: null
                    },
                    data: {
                        readAt: new Date()
                    }
                })
                if (updated.count > 0) {

                    io.to(groupId).emit("changeToRead", userId)
                }

            } catch (error) {
                console.log(error.message);

            }

        })


        socket.on("message-readed", async (data) => {
            try {
                let updated = await prisma.message.updateMany({
                    where: {
                        senderId: data.senderId,
                        receiverId: data.receiverId,
                        status: { not: "read" }
                    },
                    data: {
                        status: "read"
                    }
                });
                if (updated.count > 0) {

                    let senderSocket = onlineUsers[data.senderId]
                    io.to(senderSocket).emit("readed");

                }
            } catch (err) {
                console.log(err.message);
            }
        });

        socket.on("receiver-data", async (data) => {
            
            let secure_url = ""
            if (data.image){
                let res = await cloudinary.uploader.upload(data.image)
                secure_url = res.secure_url  
                
            }
            let message = await prisma.message.create({
                data: {
                    senderId: data.senderId,
                    receiverId: data.receiverId,
                    content: data.content,
                    image: secure_url || "",
                    status: "sent",
                    createdAt: data.createdAt
                }
            });
        
            




            let receiverSocket = onlineUsers[data.receiverId]

            if (receiverSocket) {
                io.to(receiverSocket).emit("get-message", {
                    content: data.content,
                    createdAt: data.createdAt,
                    receiverId: data.receiverId,
                    senderId: data.senderId,
                    uniqueId: data.uniqueId
                }, async () => {

                    await prisma.message.update({
                        where: { id: message?.id, status: "sent" },
                        data: {
                            status: "delivered"
                        }
                    })
                    let senderSocket = onlineUsers[data.senderId]
                    io.to(senderSocket).emit("delivered-success", data.uniqueId)

                });
            }

        });



        // Disconnect handler
        socket.on("disconnect", () => {
            delete onlineUsers[userId];
            let OnlineUsers = Object.keys(onlineUsers);
            io.emit("getOnlines", OnlineUsers);
        });
    });

    server.listen(3000, () => {
        console.log("> Server running on http://localhost:3000");
    });
});
