import { baseUrl } from '../proxy.js';
import { mock } from '../mock.js';

import { readBodyFile } from './util/body-file-util.js';
import { readTemplateBodyFile } from './util/template-body-file-util.js';
import { getSOAPActionData } from './util/soap-xml-util.js';

/**
 * Mocks W3Schools TempConvert SOAP API.
 * Demonstrates various techniques for generating a reply - reply from XML file, reply from EJS template.
 */

const TEMPCONVERT_PATH = '/xml/tempconvert.asmx';

/**
 * Mocks CelsiusToFahrenheit SOAP action to reply from EJS template file.
 */
mock('W3Schools_TempConvert_CelsiusToFahrenheit', baseUrl, TEMPCONVERT_PATH).matchBody(body => {
    let soapActionData = getSOAPActionData('CelsiusToFahrenheit', body);

    let matchBody = soapActionData != null;

    return matchBody;
}).replyBody(body => {
    let soapActionData = getSOAPActionData('CelsiusToFahrenheit', body);

    let replyBody = readTemplateBodyFile('./W3Schools/TempConvert/SubscriberOnlinestatus/reply.ejs', soapActionData);

    return replyBody;
}).build();

/**
 * Mocks FahrenheitToCelsius SOAP action to reply from XML file.
 */
mock('W3Schools_TempConvert_FahrenheitToCelsius', baseUrl, TEMPCONVERT_PATH).matchBody(body => {
    let soapActionData = getSOAPActionData('FahrenheitToCelsius', body);

    let matchBody = soapActionData != null;

    return matchBody;
}).replyBody(_body => {
    let replyBody = readBodyFile('./W3Schools/TempConvert/FahrenheitToCelsius/reply.xml')

    return replyBody;
}).build();
