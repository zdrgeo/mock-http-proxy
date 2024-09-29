import { XMLParser } from 'fast-xml-parser';

export {
    getBodyData,
};

const xmlParser = new XMLParser({ removeNSPrefix: true });

function getBodyData(body) {
    let bodyData = xmlParser.parse(body);

    return bodyData;
}
