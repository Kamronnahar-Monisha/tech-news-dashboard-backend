import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
//import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(helmet());
//app.use(morgan('dev'));

// Basic rate limiting
const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

// Mock news fallback
const mockNewsPath = path.join(__dirname, '../mock/news.sample.json');

app.get('/news', async (req, res) => {
    //console.log(req);
    interface Article {
        source: { id: string | null; name: string };
        author: string | null;
        title: string;
        description: string;
        url: string;
        urlToImage: string;
        publishedAt: string;
        content: string;
    }
    try {
        const query: any | string = req.query.q || 'technology';
        const category = req.query.category;
        const url = `https://newsapi.org/v2/everything?qInTitle=${query}${category ? '+' + category : ''}&apiKey=${process.env.NEWSAPI_KEY}&language=en&pageSize=50`;

        if (!process.env.NEWSAPI_KEY) {
            const mockData = fs.readFileSync(mockNewsPath, 'utf-8');
            return res.json(JSON.parse(mockData));
        }

        const response = await axios.get(url);
        console.log(response.data);
        res.json(response.data);
    } catch (error) {
        const mockData = fs.readFileSync(mockNewsPath, 'utf-8');
        res.json(JSON.parse(mockData));
    }
});

//app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
export default app;