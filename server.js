console.log("1. Next imported");
const cloudinary = require("./src/lib/cloudinary.js");
console.log("2. Next imported");
require('dotenv').config();
console.log("3. Next imported");
const {instrument} = require("@socket.io/admin-ui")
console.log("4. Next imported");
const prisma = require("./src/lib/prisma");
console.log("5. Next imported");
const next = require("next");
console.log("6. Next imported");
const Server = require("socket.io").Server;
console.log("7. Next imported");
const createServer = require("http").createServer;
console.log("8. Next imported");
const port = process.env.PORT || 3000
console.log("9. Next imported");
const app = next({ dev: process.env.NODE_ENV !== "production"});
console.log("10. Next imported");
console.log(process.env.NODE_ENV !== "production")
console.log("11. Next imported");
const handler = app.getRequestHandler();
console.log("12. Next imported");
console.log(process.env.NODE_ENV);
console.log("13. Next imported");

app.prepare().then(() => {
    console.log("14. Next imported");


    let server = createServer(handler);
server.on('request', (req, res) => {
    if (req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Server is healthy!');
        return;
    }
    // Let Next.js handle all other requests
    handler(req, res);
});
    let io = new Server(server, {
        cors: {
            origin: process.env.NEXTAUTH_URL,
            credentials: true
        }
    });
    instrument(io,{
        auth : false,

    })
    let onlineUsers = {};

    io.on("connection", async (socket) => {
        let userId = socket.handshake?.auth?.userId;
        onlineUsers[userId] = socket.id;

        let OnlineUsers = Object.keys(onlineUsers);
        io.emit("getOnlines", OnlineUsers);




        if (userId) {
            let [messagesUpdate, messageStatusUpdate, friendRequests] = await Promise.all([
                prisma.message.updateMany({
                    where: { receiverId: userId, status: "sent" },
                    data: {
                        status: "delivered",
                    }
                }),
                prisma.messageStatus.updateMany({
                    where: {
                        userId: userId
                    },
                    data: {
                        deliveredAt: new Date()
                    }
                }
            ),
            prisma.friendRequest.findMany({
                    where : {
                        OR : [
                            {senderId : userId},
                            {receiverId : userId}
                        ],
                        status : "Accepted"
                    },
                    select : {
                        receiverId : true,
                        senderId : true
                    }
                })
        ]
        )
            
            let ids = friendRequests.map((obj)=>{
                if (obj.senderId === userId){
                    return onlineUsers[obj.receiverId]
                }
                return onlineUsers[obj.senderId]
            })
            
            for (const id of ids) {
                if (id){
                    io.to(id).emit("changeStatus-all", userId)

                }
            }
        }


        socket.on("join-users", (groupObj, ack) => {
        
                
                for (let key in groupObj) {
    
                    
                groupObj[key].forEach(obj => {
                    let userSocket = io.sockets.sockets.get(onlineUsers[obj.userId])
                    
                    if (userSocket) {
                        
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
                                    userId: user.userId,
                                    status: "sent",
                                    deliveredAt: null,
                                    readAt: null
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
                        status: "delivered"
                    }
                })
                io.to(groupId).emit("groupDelivered-success", message)
            }
        })
        socket.on("read-groupMessage", async (message, groupId) => {

            if (message.deliveredAt !== null && message.readAt !== null && message.id) {

                await prisma.messageStatus.update({
                    where: {
                        id: message?.id
                    },
                    data: {
                        deliveredAt: message.deliveredAt,
                        readAt: message.readAt,
                        status: "readed"
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
                    select: {
                        id: true
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
                        status: "read",

                    }
                });
                if (updated.count > 0) {

                    let senderSocket = onlineUsers[data.senderId]
                    io.to(senderSocket).emit("readed", data.chatId);

                }
            } catch (err) {
                console.log(err.message);
            }
        });

        socket.on("receiver-data", async (data,chatId) => {
         
            let secure_url = ""
            if (data.image) {
                secure_url = (await cloudinary.uploader.upload(data.image)).secure_url
            }
            let dbData = {
                senderId: data.senderId,
                receiverId: data.receiverId,
                content: data.content,
                image: secure_url || "",
                status: "sent",
                createdAt: data.createdAt,

            }
            if (data?.replyToId){
                dbData = {...dbData,replyToId : data.replyToId}
            }
                let message = await prisma.message.create({
                    data: dbData,
                    include : {
                        Reactors : true
                    }
                });
              
                


            let receiverSocket = onlineUsers[data.receiverId]
            if (receiverSocket) {
                io.to(receiverSocket).emit("get-message", message,chatId, async () => {

                    await prisma.message.update({
                        where: { id: message?.id, status: "sent" },
                        data: {
                            status: "delivered"
                        }
                    })
                    let senderSocket = onlineUsers[data.senderId]
                    io.to(senderSocket).emit("delivered-success", data.uniqueId,{...message,status : "delivered" , userId : chatId})

            })}
            let userSocket = onlineUsers[userId]
            io.to(userSocket).emit("upodateIndexdb",data.uniqueId,message)
        })

        socket.on("typing",data=>{
                let receiverSocket = onlineUsers[data.receiverId]
            io.to(receiverSocket).emit("typingIndicator" , data)
            
            
        })

        socket.on("reaction",(data,receiverId)=>{
            
            let receiverSocket = onlineUsers[receiverId]
            io.to(receiverSocket).emit("receive-reaction",data)
        })
        socket.on("delete-reaction",(data,receiverId)=>{
            let receiverSocket = onlineUsers[receiverId]
            io.to(receiverSocket).emit("d-reaction",data)
        })
        socket.on("update-reaction",(data,receiverId)=>{
            let receiverSocket = onlineUsers[receiverId]
            io.to(receiverSocket).emit("u-reaction",data)
        })

        socket.on("delete-message",(receiverId,id)=>{
            let receiverSocket = onlineUsers[receiverId]
            io.to(receiverSocket).emit("deleleMessage",id)
        })


        socket.on("sendRequest",(user)=>{
            let receiverSocket = onlineUsers[user.id]

            io.to(receiverSocket).emit("request_receive_notification",user)
        })

        socket.on("cancelRequest",(user)=>{
    
            let receiverSocket = onlineUsers[user.id]
            io.to(receiverSocket).emit("cancel_request",user)

        })

        socket.on("requestAccepted",(user,senderId)=>{

            let receiverSocket = onlineUsers[senderId]
            io.to(receiverSocket).emit("request_accepted",user)


        })  


        // Disconnect handler
        socket.on("disconnect", async () => {
            delete onlineUsers[userId];
            let OnlineUsers = Object.keys(onlineUsers);
            io.emit("getOnlines", OnlineUsers);
            let date = new Date()
            let updated = await prisma.account.update({
                where: {
                    id: userId
                },
                data: {
                    lastseen: date
                },
                select: {
                    lastseen: true,
                    id: true
                }
            })

            let friends = await prisma.friendRequest.findMany({
                where: {
                    OR: [
                        { senderId: userId },
                        { receiverId: userId },
                    ],
                    status: "Accepted"
                },
                select: {
                    receiverId: true,
                    senderId: true
                }
            })
            let friendIds = friends.map((friend) => {
                return friend.senderId === userId ? friend.receiverId : friend.senderId
            })

            for (const id of friendIds) {
                io.to(onlineUsers[id]).emit("lastseen", { updated })
            }
        });
    });

    server.listen(port, () => {
        console.log("=== ENVIRONMENT VARIABLES ===");
console.log("DATABASE_URL:", process.env.DATABASE_URL ? "SET" : "NOT SET");
console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
console.log("================================");
        console.log("> Server running on http://localhost:3000");
    });
}).catch(()=>{
     console.error("=== APP PREPARE FAILED ===");
    console.error(err);
    process.exit(1);
})
