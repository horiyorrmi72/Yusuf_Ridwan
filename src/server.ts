import express, { Request, Response } from 'express'
import { wrappedResponse } from './middlewares/reposnseWrapper'
import { handleError } from './middlewares/errorHandler'
import { configVariables } from './configs'
import routes from './routes'
import { sequelize } from './configs/db'
import { checkQueueHealth, initQueueConnection } from './configs/rabbitmq'
const { port } = configVariables;

const app = express();
app.use(express.json());
app.use(wrappedResponse);

app.use('/api', routes)

app.get('/queue-health', async (req: Request, res: Response) => {
    try {
        const queueHealthy = await checkQueueHealth();
        if (!queueHealthy) {
            return res.fail('Queue disconnected', 503);
        }
        res.success('ok', {
            RabbitMqHealthy: queueHealthy,
            upTime: process.uptime(),

        });
    } catch (error) {
        res.fail('health check failed', 500)
    }
})

app.get('/health', async (req: Request, res: Response) => {
    try {
        const dbHealthy = await sequelize.authenticate()
            .then(() => true)
            .catch(() => false);
        const queueHealthy = await checkQueueHealth();
        res.success('ok', {
            databaseHealthy: dbHealthy, RabbitMqHealthy: queueHealthy,
            upTime: process.uptime(),
        });
    } catch (error) {
        res.fail('health check failed', 500)
    }
})

app.use(handleError);
export const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('db connected');

        await initQueueConnection();
        console.log('RabbitMQ Connected');


        app.listen(port, () => {
            console.log(`Server running on port ${port}`)
        })

    } catch (error) {
        console.error('failed to start the server:', error);
        process.exit(1);
    }
}

startServer()