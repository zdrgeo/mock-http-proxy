import ejs from 'ejs';

import { readBodyFile } from './body-file-util.js';

export {
    readTemplateBodyFile
};

function readTemplateBodyFile(fileName, data) {
    let templateBody = readBodyFile(fileName);

    let body = ejs.render(templateBody, { data: data });

    return body;
}
