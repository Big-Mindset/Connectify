import { createClient } from 'redis';

export const client = createClient({
    username: 'default',
    password: 'bYh0zBiC5hHD2FFcALJR0gdmVin8EpA8',
    socket: {
        host: 'redis-14639.c263.us-east-1-2.ec2.redns.redis-cloud.com',
        port: 14639
    },

});

client.on('error', err => console.log('Redis Client Error', err));

await client.connect();

await client.set('foo', 'bar');
const result = await client.get('foo');
console.log(result)  // >>> bar

