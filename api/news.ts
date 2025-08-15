import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const mockNewsPath = path.join(process.cwd(), 'mock/news.sample.json');

  try {
    const query = (req.query.q as string) || 'technology';
    const category = (req.query.category as string) || '';
    const apiKey = process.env.NEWSAPI_KEY;

    // Return mock data if API key is missing
    if (!apiKey) {
      const mockData = fs.readFileSync(mockNewsPath, 'utf-8');
      return res.json(JSON.parse(mockData));
    }

    const url = `https://newsapi.org/v2/everything?qInTitle=${encodeURIComponent(query)}${category ? '+' + encodeURIComponent(category) : ''}&apiKey=${apiKey}&language=en&pageSize=50`;

    const response = await axios.get(url);
    res.status(200).json(response.data.articles);
  } catch (error) {
    const mockData = fs.readFileSync(mockNewsPath, 'utf-8');
    res.status(200).json(JSON.parse(mockData));
  }
}
