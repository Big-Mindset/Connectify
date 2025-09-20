import { createClient } from 'redis';

export const client = createClient({
    username: 'default',
    password: 'rqqO1YomCM5nNqNdObui6OKxlbjY7qfv',
    socket: {
        host: 'redis-14236.c10.us-east-1-4.ec2.redns.redis-cloud.com',
        port: 14236
    }
});

client.on('error', err => console.log('Redis Client Error', err));

await client.connect();
