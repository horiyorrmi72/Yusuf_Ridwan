import LeaveWorker from './worker';
import LeaveRequestRepo from '../repositories/leaveRequest.repo';
import ProcessedMessageRepo from '../repositories/processedMessage.repo';
import models from '../models';
import { configVariables } from '../configs';

(async () => {
    try {
        const worker = new LeaveWorker(
            configVariables.rabbit.url,
            new LeaveRequestRepo(models.LeaveRequest),
            new ProcessedMessageRepo(models.ProcessedMessages)
        );

        await worker.connect();
        console.log('[Worker] Started successfully');
    } catch (err) {
        console.error('[Worker] Failed to start:', err);
        process.exit(1);
    }
})();
