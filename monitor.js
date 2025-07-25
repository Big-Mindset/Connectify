// src/utils/monitor-connections.js
const { MongoClient } = require('mongodb') // Use require for Node.js scripts

const connectionString = "mongodb+srv://wadood:wadoodis10@chat-app.lqqfhzm.mongodb.net/Connectify?retryWrites=true&w=majority&appName=chat-app&maxPoolSize=10&minPoolSize=2&maxIdleTimeMS=30000&serverSelectionTimeoutMS=5000"

async function monitorConnections() {
  let client
  
  try {
    console.log('🔌 Connecting to MongoDB...')
    client = new MongoClient(connectionString)
    await client.connect()
    
    console.log('✅ Connected! Monitoring connections...\n')
    
    // Monitor every 5 seconds
    setInterval(async () => {
      try {
        const admin = client.db().admin()
        const status = await admin.command({ serverStatus: 1 })
        
        console.log(`\n📊 Connection Status - ${new Date().toLocaleTimeString()}`)
        console.log(`├─ Current Connections: ${status.connections.current}`)
        console.log(`├─ Available Connections: ${status.connections.available}`)
        console.log(`└─ Total Created: ${status.connections.totalCreated}`)
        
        // Check if we're within our pool limits
        if (status.connections.current >= 2) {
          console.log('✅ Minimum connections maintained (≥2)')
        }
        if (status.connections.current <= 10) {
          console.log('✅ Within maximum pool size (≤10)')
        }
        
      } catch (error) {
        console.log('❌ Monitoring error:', error.message)
      }
    }, 5000)
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message)
    process.exit(1)
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down monitor...')
  process.exit(0)
})

console.log('🚀 Starting MongoDB connection monitor...')
console.log('Pool Settings: min=2, max=10, idleTimeout=30s')
console.log('Press Ctrl+C to stop\n')

monitorConnections()