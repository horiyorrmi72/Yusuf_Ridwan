import * as amqplib from 'amqplib';
import { configVariables } from '.';
const { rabbit } = configVariables;

let connection: amqplib.Connection | null = null;

export async function initQueueConnection(): Promise<void> {
    if (connection) return;
    const amqpUrl = rabbit.url
    connection = await amqplib.connect(amqpUrl) as unknown as amqplib.Connection;
}

export async function checkQueueHealth(): Promise<boolean> {
    try {
        if (!connection) await initQueueConnection();
        return !!connection;

    } catch {
        return false;
    }
}