
class ChatData {
    constructor() {
        this.name = "Connectify",
            this.version = 1,
            this.db = null
    }
    async init() {
        if (this.db) return this.db
        let request = indexedDB.open(this.name, this.version)
        return new Promise((res, rej) => {

            request.onsuccess = () => {
                this.db = request.result
                this.db.onclose = () => {
                    this.db = null;
                };
                res(this.db)
            }
            request.onerror = () => {

                rej(request.error)

            },
                request.onupgradeneeded = (event) => {
                    let db = event.target.result
                    if (!db.objectStoreNames.contains("Emojies")) {
                        db.createObjectStore("Emojies", { autoIncrement: true })
                    }
                    if (!db.objectStoreNames.contains("Message")) {
                        let createMessage = db.createObjectStore("Message", { keyPath: "id" })
                        createMessage.createIndex("userId", "userId", { unique: false })
                        createMessage.createIndex("userId_createdAt", ["userId", "createdAt"], { unique: false })
                    }
                }
        })

    }

    async AddEmojies(emojies) {
        await this.init()
        let tx = this.db.transaction(["Emojies"], "readwrite")
        let emojiStore = tx.objectStore("Emojies")
        let addEmoji = emojiStore.add(emojies)
        return new Promise((resolve, reject) => {
            addEmoji.onsuccess = () => {
                resolve("Emojies added")
            },
                addEmoji.onerror = () => {

                    reject(addEmoji.error)
                }
        })
    }
    async getEmojies() {
        await this.init()
        let tx = this.db.transaction(["Emojies"], "readonly")
        let emojiStore = tx.objectStore("Emojies")
        let getemoji = emojiStore.getAll()
        return new Promise((resolve, reject) => {
            getemoji.onsuccess = () => {
                resolve(getemoji.result[0])
            },
                getemoji.onerror = () => {

                    reject(getemoji.error)
                }
        })
    }
    async addMessages(message) {

        await this.init()

        let tx = this.db.transaction(["Message"], "readwrite")
        let objectStore = tx.objectStore("Message")
        let addMessages = objectStore.put(message)
        return new Promise((resolve, reject) => {
            addMessages.onsuccess = () => {

                resolve("Message Added successfully")
            },
                addMessages.onerror = () => {

                    reject(getemoji.error)
                }
        })

    }
    async AddAllMessages(allMessages) {

        await this.init()
        let tx = this.db.transaction(["Message"], "readwrite")
        let msgStore = tx.objectStore("Message")
        for (let i = 0; i < allMessages.length; i++) {
            let messages = allMessages[i].messages
            let messagesId = allMessages[i].id
            for (let j = 0; j < messages.length; j++) {
                let message = messages[j]

                msgStore.put({ ...message, userId: messagesId })

            }

        }
        return new Promise((resolve, reject) => {

            tx.oncomplete = () => {

                resolve()
            }
            tx.onerror = () => {

                reject(tx.error)
            }
        })
    }
    async getOneMessage() {
        await this.init()
        const tx = this.db.transaction(["Message"], "readonly")
        const msgStore = tx.objectStore("Message")

        return new Promise((resolve, reject) => {
            const cursorRequest = msgStore.openCursor()

            cursorRequest.onsuccess = (event) => {
                const cursor = event.target.result

                if (cursor) {
                    resolve(cursor.value)
                } else {
                    resolve(null)
                }
            }

            cursorRequest.onerror = (event) => {
                reject(event.target.error)
            }
        })
    }

    async getmessagebyid(userId) {
        await this.init()
        let tx = this.db.transaction(["Message"], "readonly")
        let msgStore = tx.objectStore("Message")
        let indexing = msgStore.index("userId_createdAt")
        let bound = IDBKeyRange.bound([userId, ""], [userId, "~"])
        let AllMessages = []
        return new Promise((resolve, reject) => {
            let messages = indexing.openCursor(bound, "prev")


            messages.onsuccess = (event) => {
                let result = event.target?.result

                if (result) {
                    let message = result.value
                    AllMessages.push(message)
                    if (AllMessages.length === 50) {
                        resolve(AllMessages)
                        return
                    }
                    result.continue()
                } else {
                    resolve(AllMessages);

                }
            }
            messages.onerror = () => {
                reject("Error getting messages")
            }
        })
    }
    async updatemessage(id, message, userId) {
        await this.init()
        let tx = this.db.transaction(["Message"], "readwrite")
        let msgStore = tx.objectStore("Message")
        let deletemsg = msgStore.delete(id)
        return new Promise((resolve, reject) => {
            deletemsg.onsuccess = () => {
                let messageData = { ...message, userId: userId }
                let addNew = msgStore.add(messageData)
                addNew.onsuccess = () => {

                    resolve("Message Updated")
                }
                addNew.onerror = () => resolve("Error Updated message")
            }
            deletemsg.onerror = () => {
                reject("Error deleting message")
            }
        })
    }
    async deleteMessage(id, boolean) {

        await this.init()
        let tx = this.db.transaction(["Message"], "readwrite")
        let msgStore = tx.objectStore("Message")
        if (!boolean) {
            msgStore.delete(id)

            return new Promise((resolve, reject) => {
                msgStore.onsuccess = () => resolve("Deleted")
                msgStore.onerror = () => {
                    reject("Error deleting message")
                }
            })
        }
        let message = msgStore.get(id)
        return new Promise((resolve, reject) => {
            message.onsuccess = () => {
                let result = message.result
                let fields = { DeleteForEveryone: true, }
                let updatedMessage = { ...result, ...fields, content: "", Reactors: [] }

                let update = msgStore.put(updatedMessage)
                update.onsuccess = () => {
                    resolve("Deleted")
                }
                update.onerror = () => {
                    resolve(update.error)

                }
            }
            message.onerror = () => {
                reject("error deleting message")
            }
        })
    }
    async updateToRead(userId, status) {
        console.log(status);

        await this.init()
        let tx = this.db.transaction(["Message"], "readwrite")
        let msgStore = tx.objectStore("Message")
        let index = msgStore.index("userId")
        const keyRange = IDBKeyRange.only(userId)
        let updateMsg = index.openCursor(keyRange)
        return new Promise((resolve, reject) => {

            updateMsg.onsuccess = (event) => {
                let result = event.target?.result
                if (result) {
                    let message = result.value
                    let isTrue = status === "read" ? true : message.status === "sent"
                    if (message.status !== status && isTrue) {
                        message.status = status
                        result.update(message)

                    }
                    result.continue()
                } else {
                    resolve("All messages updated");

                }
            }
            updateMsg.onerror = () => {
                reject("Error updating messages")
            }
        })

    }
    async DeleteReation(data) {
        await this.init()
        let transaction = this.db.transaction(["Message"], "readwrite")
        let objectStore = transaction.objectStore("Message")
        let response = objectStore.get(data.id)

        return new Promise((res, rej) => {
            response.onsuccess = () => {
                let message = response.result
                let reactors = message.Reactors.filter((obj) => obj.id !== data.reactionId)
                message.Reactors = reactors
                let resp = objectStore.put(message)

                resp.onsuccess = () => res("Successful")
                resp.onerror = () => rej("Error updating data")

            }
            response.onerror = () => rej("Error getting Message")

        })
    }
    async UpdateReaction(data) {
        await this.init()
        let transaction = this.db.transaction(["Message"], "readwrite")
        let objectStore = transaction.objectStore("Message")
        let response = objectStore.get(data.id)

        return new Promise((res, rej) => {
            response.onsuccess = () => {
                let message = response.result
                let reactors = message.Reactors.map((obj) => {
                    if (obj.id === data.reactionId) {
                        return { ...obj, emoji: data.url }
                    }
                    return obj
                })
                message.Reactors = reactors
                let resp = objectStore.put(message)

                resp.onsuccess = () => res("Successful")
                resp.onerror = () => rej("Error updating data"
                )
            }
            response.onerror = () => rej("Error getting Message")

        })
    }
    async deleteLastMessage(userId) {
        await this.init();

        const transaction = this.db.transaction(["Message"], "readwrite");
        const objectStore = transaction.objectStore("Message");
        const index = objectStore.index("userId_createdAt");
        let count = await new Promise((resolve, reject) => {
            let req = index.count()

            req.onsuccess = () => {
                let result = req.result
                resolve(result)
            }
            req.onerror = () => {

                reject(req.error)
            }
        })
        if (count > 200) {

            return new Promise((resolve, reject) => {
                const range = IDBKeyRange.bound(
                    [userId, ""],
                    [userId, "~"],
                    false,
                    false
                );

                const request = index.openCursor(range, "next");

                request.onsuccess = (e) => {
                    const cursor = e.target.result;

                    if (cursor) {

                        const deleteRequest = cursor.delete();

                        deleteRequest.onsuccess = () => {
                            resolve(cursor.value);
                        };

                        deleteRequest.onerror = () => {
                            reject(deleteRequest.error);
                        };
                    } else {
                        resolve(null);
                    }
                };

                request.onerror = () => {
                    reject(request.error);
                };
            });
        }


    }
    async updateAllReactions(array) {
        await this.init()
        console.log("updating the reactions");

        console.log(array);

        let tx = this.db.transaction(["Message"], "readwrite")
        let messageStore = tx.objectStore("Message")
        for (let i = 0; i < array.length; i++) {
            let reactions = array[i].Chat_Reactions


            for (let j = 0; j < reactions.length; j++) {
                let reaction = reactions[j]
                let getmessage = messageStore.get(reaction.reactTo)
                console.log("the message is .");

                await new Promise((resolve, reject) => {
                    getmessage.onsuccess = () => {
                        let message = getmessage.result
                        console.log(message);
                        if (message) {
                            let updated = []
                            if (message.Reactors.length === 0) {
                                message.Reactors.push(reaction)
                                messageStore.put(message)


                            } else {

                                message.Reactors.forEach((r) => {
                                    if (r.id === reaction.id) {
                                        updated.push(reaction)
                                    } else {
                                        updated.push(r)
                                    }
                                })

                                message.Reactors = updated
                                messageStore.put(message)
                            }
                            resolve()
                        }
                    }
                    getmessage.onerror = reject
                })


            }
        }
        await tx.done
    }
    async getMoreMessagesIndex(userId , createdAt) {
        await this.init()
        let tx = this.db.transaction(["Message"], "readonly")
        let messageStore = tx.objectStore("Message")
        let index = messageStore.index("userId_createdAt")
        let range = IDBKeyRange.bound(
            [userId,""],
            [userId , createdAt],
            false,
            true
        )
        return new Promise((resolve , reject)=>{
            let req = index.openCursor(range,"prev")
            let messages = []
            
            req.onsuccess = (res)=>{

                let cursor = res.target.result
                if (cursor && messages.length < 30){
                    
                    let message = cursor.value
                    messages.push(message)
                    cursor.continue()
                }else{
                    resolve({ok : true,message : messages})
                }
            }
            req.onerror = ()=>reject("Messages not found")
        })
    }
    async deleteDatabase() {
        if (this.db) {
            this.db.close()
            this.db = null
        }
        return new Promise((resolve, reject) => {
            let deleteDatabase = indexedDB.deleteDatabase("Connectify")
            deleteDatabase.onsuccess = () => {
                resolve();
            };

            deleteDatabase.onerror = (event) => {
                reject(event);
            };
        })
    }


}
let chat = new ChatData()
let addemoji = (emoji) => chat.AddEmojies(emoji)
let getemoji = () => chat.getEmojies()
let addallmessages = (allMessages) => chat.AddAllMessages(allMessages)
let getOneMessage = () => chat.getOneMessage()
let getmessagebyid = (userId) => chat.getmessagebyid(userId)
let addmessage = (message) => chat.addMessages(message)
let updatemessage = (id, message, userId) => chat.updatemessage(id, message, userId)
let updateToRead = (userId, status) => chat.updateToRead(userId, status)
let deletereaction = (data) => chat.DeleteReation(data)
let updatereaction = (data) => chat.UpdateReaction(data)
let deletelastmessage = (chatId) => chat.deleteLastMessage(chatId)
let deletemessage = (id, boolean) => chat.deleteMessage(id, boolean)
let updateallreactions = (array) => chat.updateAllReactions(array)
let deletedatabase = () => chat.deleteDatabase()
let getmoremessagesIndex = (userId , createdAt) => chat.getMoreMessagesIndex(userId , createdAt)
export { addemoji, getemoji, addallmessages, getOneMessage, getmessagebyid, addmessage, updatemessage, updateToRead, deletereaction, updatereaction, deletelastmessage, deletemessage, updateallreactions, deletedatabase , getmoremessagesIndex }