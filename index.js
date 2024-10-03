import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { readdir } from 'node:fs/promises';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

import { baseUrl } from './proxy.js';
import { mockPath } from './mock.js';

const items = await readdir(mockPath, { withFileTypes: true, recursive: false });

await Promise.all(items.filter(item => item.isFile() && path.extname(item.name) === '.js').map(async item => {
    let itemPath = path.join(mockPath, item.name);

    try {
        await import(pathToFileURL(itemPath));
    
        console.log('Mock path: %s.', itemPath);
    } catch (error) {
        console.error('Mock path: %s, error: %s.', itemPath, error.message);
    }
}));

const proxyMiddleware = createProxyMiddleware({
    target: baseUrl,
    changeOrigin: true,
});

const proxy = express();

proxy.use(proxyMiddleware);

const port = process.env.PORT || 3000;

proxy.listen(port, () => { console.log(`Mock HTTP Proxy is running on port ${port}.`) });
