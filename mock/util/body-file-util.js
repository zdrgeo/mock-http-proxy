import path from 'node:path';
import { readFileSync } from 'node:fs';

import { mockPath } from '../../mock.js';

export {
    readBodyFile
};

function readBodyFile(fileName) {
    let filePath = path.join(mockPath, fileName);

    let body = readFileSync(filePath, 'utf8');

    return body;
}
