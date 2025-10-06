export interface RetryStrategy {
    execute<T>(fn: () => Promise<T>, retries: number): Promise<T>;
}

export class ExponentialRetryStrategy implements RetryStrategy {
    async execute<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
        let attempt = 0;
        while (attempt < retries) {
            try {
                return await fn();
            } catch (err) {
                attempt++;
                const delay = Math.pow(2, attempt) * 1000;
                console.warn(`[Retry] Attempt ${attempt} failed. Retrying in ${delay / 1000}s`);
                await new Promise((res) => setTimeout(res, delay));
            }
        }
        throw new Error('Max retry attempts reached.');
    }
}
