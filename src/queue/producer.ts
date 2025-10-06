import amqp from 'amqplib';

export default class Producer {
    private url: string;
    private conn: any;
    private ch: any;
    private readonly exchange = 'leave-exchange';

    constructor(url: string) {
        this.url = url;
    }

    private async connect(): Promise<void> {
        if (this.conn && this.ch) return;

        this.conn = await amqp.connect(this.url);
        this.ch = await this.conn.createChannel();
        await this.ch.assertExchange(this.exchange, 'topic', { durable: true });

        this.conn.on('error', (err: any) => {
            console.error('[Producer] Connection error:', err);
            this.conn = undefined;
            this.ch = undefined;
        });

        this.conn.on('close', () => {
            console.warn('[Producer] Connection closed.');
            this.conn = undefined;
            this.ch = undefined;
        });
    }

    async publish(routingKey: string, message: Record<string, any>, opts: any = {}): Promise<void> {
        await this.connect();
        if (!this.ch) throw new Error('RabbitMQ channel not initialized');

        const payload = Buffer.from(JSON.stringify(message));
        const success = this.ch.publish(this.exchange, routingKey, payload, {
            persistent: true,
            contentType: 'application/json',
            ...opts,
        });

        if (!success) {
            console.warn('[Producer] Publish returned false, possible queue pressure.');
        }
    }

    async close(): Promise<void> {
        if (this.ch) await this.ch.close();
        if (this.conn) await this.conn.close();
        this.ch = undefined;
        this.conn = undefined;
    }
}
