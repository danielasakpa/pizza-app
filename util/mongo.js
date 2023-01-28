const mongoose = require('mongoose');

const MONGO_URL = "mongodb://oba_daniel:Ogfundz304@blogcluster-shard-00-00.rk7lv.mongodb.net:27017,blogcluster-shard-00-01.rk7lv.mongodb.net:27017,blogcluster-shard-00-02.rk7lv.mongodb.net:27017/pizza?ssl=true&replicaSet=atlas-t0b97g-shard-0&authSource=admin&retryWrites=true&w=majority"

// if (!MONGO_URL) {
//     throw new Error(
//         'Please define the MONGO_URL environment variable inside .env.local'
//     )
// }

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        }

        cached.promise = mongoose.connect(MONGO_URL, opts).then((mongoose) => {
            return mongoose
        })
    }
    cached.conn = await cached.promise
    return cached.conn
}

module.exports = dbConnect