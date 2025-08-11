import * as express from 'express';
import * as cors from 'cors';
import 'reflect-metadata';
import { config } from 'dotenv';
import { AppDataSource } from './database/data-source';
import sessionRoutes from './routes/session.routes';

config();

const app = express();
const PORT = parseInt(process.env.PORT, 10);

app.use(
    cors({
        origin: `*`,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', sessionRoutes);

AppDataSource.initialize()
    .then(() => {
        console.log('DataSource successfully initialized!');

        app.get('/', (_req, res) => {
            res.send('mystudios backend is running');
        });

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server is running at http://0.0.0.0:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error while initializing AppDataSource:', error);
    });
