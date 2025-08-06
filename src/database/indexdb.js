
class ChatData{
    constructor(){
        this.initialized = false,
        this.name = "Connectify",
        this.version = 1,
        this.db = null
    }
    async init (){
        if (this.initialized) return this.db
        let request = indexedDB.open(this.name,this.version)
        return new Promise((res,rej)=>{

            request.onsuccess = ()=>{
                this.db = request.result
                this.initialized = true
                res(this.db)
            }
            request.onerror = ()=>{
                console.log("Error Connecting" + request.error)
                rej(request.error)
                
            },
            request.onupgradeneeded = (event)=>{
                let db = event.target.result
                if (!db.objectStoreNames.contains("Sessions")){
                    db.createObjectStore("Session",{autoIncrement : true})
                }
                if (!db.objectStoreNames.contains("Emojies")){
                    db.createObjectStore("Emojies",{autoIncrement : true})
                }
                if (!db.objectStoreNames.contains("Message")){
                   let createMessage =  db.createObjectStore("Message",{keyPath : "id"})
                   createMessage.createIndex("userId", "userId",{unique : false})
                }
            }
        })

    }
    async addSession(session){
        await this.init()
        let tx = this.db.transaction(["Session"],"readwrite")
        let sessionObject = tx.objectStore("Session")
        let addsession =  sessionObject.add(session)
        return new Promise((resolve, reject) => {
            addsession.onsuccess = ()=>{
                resolve(addsession.result)
            },
            addsession.onerror = ()=>{
                console.log("Error adding Session");
                
                reject(addsession.error)
            }
        })
    }
    async getSession(){
        await this.init()
        let tx = this.db.transaction(["Session"],"readonly")
        let sessionObject = tx.objectStore("Session")
        let getsession = sessionObject.getAll()
        return new Promise((resolve, reject) => {
            getsession.onsuccess = ()=>{
                resolve(getsession.result[0])
            },
            getsession.onerror = ()=>{
                console.log("Error getting Session");
                
                reject(getsession.error)
            }
        })
    }
    async AddEmojies(emojies){
        await this.init()
        let tx = this.db.transaction(["Emojies"],"readwrite")
        let emojiStore = tx.objectStore("Emojies")
        let addEmoji = emojiStore.add(emojies)
        return new Promise((resolve , reject)=>{
            addEmoji.onsuccess = ()=>{
                resolve("Emojies added")
            },
            addEmoji.onerror = ()=>{
                console.log("Error getting Session");
                
                reject(addEmoji.error)
            }
        })
    }   
    async getEmojies(){
        await this.init()
        let tx = this.db.transaction(["Emojies"],"readonly")
        let emojiStore = tx.objectStore("Emojies")
        let getemoji = emojiStore.getAll()
        return new Promise((resolve , reject)=>{
            getemoji.onsuccess = ()=>{
                resolve(getemoji.result[0])
            },
            getemoji.onerror = ()=>{
                console.log("Error getting Session");
                
                reject(getemoji.error)
            }
        })
    }
    async addMessages (message){
        await this.init()
        let tx = this.db.transaction("Message")
        let objectStore = tx.objectStore(["Message"],"readwrite")
        let addMessages = objectStore.add(message)
        return new Promise((resolve , reject)=>{
            addMessages.onsuccess = ()=>{
                resolve("Message Added successfully")
            },
            addMessages.onerror = ()=>{
                console.log("Error getting Session");
                
                reject(getemoji.error)
            }
        })

    }
    async AddAllMessages (allMessages){
        await this.init()
        let tx = this.db.transaction(["Message"],"readwrite")
        let msgStore = tx.objectStore("Message")
        for (let i = 0; i < allMessages.length; i++) {
            let messages= allMessages[i].messages
            let messagesId= allMessages[i].id
            for (let j = 0; j < messages.length; j++) {
                let message = messages[j]
                msgStore.add({...message ,userId : messagesId })
                
            }
            
        }
        return new Promise((resolve , reject)=>{

            tx.oncomplete = ()=>{
                console.log("Messages Added Successfully");
                    resolve()
            }
            tx.onerror = ()=>{
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
                    console.log("One message found")
                    resolve(cursor.value) 
                } else {
                    console.log("No messages found")
                    resolve(null) 
                }
            }
    
            cursorRequest.onerror = (event) => {
                console.error("Error getting message")
                reject(event.target.error)
            }
        })
    }
    
    async getmessagebyid (userId){
        await this.init()
        let tx = this.db.transaction(["Message"],"readonly")
        let msgStore = tx.objectStore("Message")
        let indexing = msgStore.index("userId")
        let messages = indexing.getAll(userId)
        return new Promise((resolve , reject)=>{
            messages.onsuccess = ()=>{
                console.log("Messages found");
                
                resolve(messages.result)
            }
            messages.onerror = ()=>{
                console.log("Error getting messages");
                
                reject(messages.error)
            }
        })
    }
    async addmessage(message){
        await this.init()
        let tx = this.db.transaction(["Message"],"readwrite")
        let msgStore = tx.objectStore("Message")
        let addmessage = msgStore.add(message)
        return new Promise((resolve, reject) => {
            addmessage.onsuccess = ()=>{
                console.log("Message updated")
                resolve("Message Added")
            }
            addmessage.onerror = ()=>{
                reject("Error adding messages")
            }   
        })
    }
    async updatemessage(id,message,userId){
        await this.init()
        let tx = this.db.transaction(["Message"],"readwrite")
        let msgStore = tx.objectStore("Message")
        let deletemsg = msgStore.delete(id)
        return new Promise((resolve, reject) => {
            deletemsg.onsuccess = ()=>{
                let messageData = {...message,userId : userId}
                let addNew = msgStore.add(messageData)
                addNew.onsuccess = ()=>{
                    
                    resolve("Message Updated")}
                addNew.onerror = ()=>resolve("Error Updated message")
            }
            deletemsg.onerror = ()=>{
                reject("Error deleting message")
            }   
        })
    }
    async updatemessagestatus(message){
        await this.init()
        let tx = this.db.transaction(["Message"],"readwrite")
        let msgStore = tx.objectStore("Message")
        let updateMsg = msgStore.put(message)
        return new Promise((resolve, reject) => {
            updateMsg.onsuccess = ()=>{
                console.log("Message updated")
                resolve("Message Added")
            }
            updateMsg.onerror = ()=>{
                reject("Error adding messages")
            }   
        })
    }
    async updateToRead(userId){
        await this.init()
        let tx = this.db.transaction(["Message"],"readwrite")
        let msgStore = tx.objectStore("Message")
        let index = msgStore.index("userId")
        const keyRange = IDBKeyRange.only(userId)
        let updateMsg = index.openCursor(keyRange)
        return new Promise((resolve, reject) => { 
            
            updateMsg.onsuccess = (event)=>{
                let result = event.target?.result
                if (result){
                    let message = result.value
                    if (message.status !== "read"){
                        message.status = "read"
                        result.update(message)

                    }
                    result.continue()
                }else{
                    resolve("All messages updated");
                    
                }
            }
            updateMsg.onerror = ()=>{
                reject("Error updating messages")
            }   
        })
       
    }
    
}
let chat = new ChatData()
let addsession = (session)=>chat.addSession(session)
let getsession = () => chat.getSession();
let addemoji = (emoji)=>chat.AddEmojies(emoji)
let getemoji = ()=>chat.getEmojies()
let addallmessages = (allMessages)=>chat.AddAllMessages(allMessages)
let getOneMessage = ()=>chat.getOneMessage()
let getmessagebyid = (userId)=>chat.getmessagebyid(userId)
let addmessage = (message)=>chat.addmessage(message)
let updatemessage = (id,message,userId)=>chat.updatemessage(id,message,userId)
let updatemessagestatus = (message)=>chat.updatemessagestatus(message)
let updateToRead = (userId)=>chat.updateToRead(userId)
export {addsession,getsession,addemoji,getemoji,addallmessages,getOneMessage,getmessagebyid,addmessage,updatemessage,updatemessagestatus,updateToRead}