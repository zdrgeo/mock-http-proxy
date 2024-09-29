import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { readdirSync } from 'node:fs';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

import { baseUrl } from './proxy.js';
import { mockPath } from './mock.js';

readdirSync(mockPath, { withFileTypes: true, recursive: false })
    .filter(item => item.isFile() && path.extname(item.name) === '.js')
    .forEach(item => {
        let itemPath = path.join(mockPath, item.name);

        import(pathToFileURL(itemPath));
        
        console.log(`Mock: ${itemPath}`);
    });

const proxyMiddleware = createProxyMiddleware({
    target: baseUrl,
    changeOrigin: true,
});

const proxy = express();

proxy.use(proxyMiddleware);

const port = process.env.PORT || 3000;

proxy.listen(port, () => { console.log(`Mock HTTP Proxy is running on port ${port}.`) });
