// @ts-nocheck
import amqp from 'amqplib';
import { ExponentialRetryStrategy } from '../strategies/retryStrategy';
import LeaveRequestRepo from '../repositories/leaveRequest.repo';
import ProcessedMessageRepo from '../repositories/processedMessage.repo';
import { sequelize } from '../configs/db';
import logger from '../utils/logger';

export default class LeaveWorker {
    constructor(url, leaveRepo, processedRepo) {
        this.url = url;
        this.leaveRepo = leaveRepo;
        this.processedRepo = processedRepo;
        this.exchange = 'leave-exchange';
        this.queue = 'leave-requests';
        this.routingKey = 'leave.requested';
        this.retryStrategy = new ExponentialRetryStrategy();
    }

    async connect() {
        this.conn = await amqp.connect(this.url);
        logger.info('consumer conn:', this.conn)
        this.ch = await this.conn.createChannel();
        await this.ch.assertExchange(this.exchange, 'topic', { durable: true });
        await this.ch.assertQueue(this.queue, { durable: true });
        await this.ch.bindQueue(this.queue, this.exchange, this.routingKey);
        console.log(`[LeaveWorker] Listening on ${this.queue}`);

        this.ch.consume(this.queue, async (msg) => {
            if (!msg) return;
            const content = JSON.parse(msg.content.toString());
            const messageId = msg.properties.messageId || `${content.leaveId}`;

            try {
                const alreadyProcessed = await this.processedRepo.findByMessageId(messageId);
                if (alreadyProcessed) {
                    logger.info(`[Worker] Message ${messageId} already processed.`);
                    return this.ch.ack(msg);
                }

                //retry
                await this.retryStrategy.execute(() => this.processLeave(content));

                //processed
                await this.processedRepo.create({ messageId });
                this.ch.ack(msg);
            } catch (err) {
                console.error(`[Worker] Failed to process ${messageId}:`, err);
                this.ch.nack(msg, false, true);
            }
        });
    }

    async processLeave(leave) {
        logger.info('leave info:', leave)
        const { leaveId, days } = leave;
        if (!leaveId) {
            throw new Error(`Missing leaveId in message: ${JSON.stringify(leave)}`);
        }
        const status = days <= 2 ? 'APPROVED' : 'PENDING_APPROVAL';

        await this.leaveRepo.updateStatus(leaveId, status);
        logger.info(`[Worker] Leave #${leaveId} set to ${status}`);
    }
}
