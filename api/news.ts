import type { VercelRequest, VercelResponse } from '@vercel/node';
import cors from 'cors';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const mockNewsPath = path.join(process.cwd(), 'mock/news.sample.json');
    res.setHeader('Access-Control-Allow-Origin', '*'); // allow all origins
    res.setHeader('Access-Control-Allow-Methods', 'GET'); // allowed methods
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

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
        // const query: any | string = req.query.q || 'technology';
        // const category = req.query.category;
        // const url = `https://newsapi.org/v2/everything?qInTitle=${query}${category ? '+' + category : ''}&apiKey=${process.env.NEWSAPI_KEY}&language=en&pageSize=50`;

        //     if (!process.env.NEWSAPI_KEY) {
        //         const mockData = fs.readFileSync(mockNewsPath, 'utf-8');
        //         return res.json(JSON.parse(mockData));
        //     }

        //     const response = await axios.get('http:google.com');
        //     console.log(response.data);
        //     res.json(response.data);
        } catch (error) {
            const mockData = fs.readFileSync(mockNewsPath, 'utf-8');
            res.json(JSON.parse(mockData));
        }
        //     const query = (req.query.q as string) || 'technology';
        //     const category = (req.query.category as string) || '';
        //     const apiKey = process.env.NEWSAPI_KEY;
        //     console.log(query,category);

        //     // Return mock data if API key is missing
        //     if (!apiKey) {
        //       const mockData = fs.readFileSync(mockNewsPath, 'utf-8');
        //       return res.json(JSON.parse(mockData));
        //     }

        //     //const url = `https://newsapi.org/v2/everything?qInTitle=${encodeURIComponent(query)}${encodeURIComponent(category) ? '+' + encodeURIComponent(category) : ''}&apiKey=${apiKey}&language=en&pageSize=50`;
        //     const url = `https://newsapi.org/v2/everything?qInTitle=${query}${category ? '+' + category : ''}&apiKey=${apiKey}&language=en&pageSize=50`;

        //     const response = await axios.get(url);
        //     res.status(200).json(response.data.articles);
        //   } catch (error) {
        //     const mockData = fs.readFileSync(mockNewsPath, 'utf-8');
        //     res.status(200).json(JSON.parse(mockData));
        //}
    }
