import * as amqplib from 'amqplib';
import { configVariables } from '.';
const { rabbit } = configVariables;

let connection: amqplib.Connection | null = null;

export async function initQueueConnection(): Promise<amqplib.Connection> {
    if (connection) return connection;
    const amqpUrl = rabbit.url
    connection = await amqplib.connect(amqpUrl) as unknown as amqplib.Connection;

    connection.on('error', (err) => {
        console.error('Rabbit-mq connection Error:', err.message);
        connection = null;
    })

    connection.on('close', () => {
        console.warn('Rabbit-mq connection closed');
        connection = null;
    })

    return connection;
}

export async function checkQueueHealth(): Promise<boolean> {
    try {
        if (!connection) await initQueueConnection();
        return !!connection;

    } catch {
        return false;
    }
}