import { getBodyData } from './xml-util.js';

export {
    getSOAPBodyData,
    getSOAPActionData,
};

function getSOAPBodyData(body) {
    let bodyData = getBodyData(body);

    return bodyData.Envelope.Body;
}

function getSOAPActionData(name, body) {
    let soapBodyData = getSOAPBodyData(body);

    if (soapBodyData.hasOwnProperty(name)) {
        let soapActionData = soapBodyData[name];

        return soapActionData;
    }

    return null;
}
