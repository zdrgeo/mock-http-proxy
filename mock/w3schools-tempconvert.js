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
 * The mock is effective only if the temperature in the request is above 20 degree Celsius.
 */
mock('W3Schools_TempConvert_CelsiusToFahrenheit', TEMPCONVERT_PATH).matchBody(body => {
    let celsiusToFahrenheit = getSOAPActionData('CelsiusToFahrenheit', body);

    return celsiusToFahrenheit?.Celsius > 20;
}).replyBody(body => {
    let celsiusToFahrenheit = getSOAPActionData('CelsiusToFahrenheit', body);

    return readTemplateBodyFile('./W3Schools/TempConvert/CelsiusToFahrenheit/reply.ejs', celsiusToFahrenheit);
}).build();

/**
 * Mocks FahrenheitToCelsius SOAP action to reply from XML file.
 */
mock('W3Schools_TempConvert_FahrenheitToCelsius', TEMPCONVERT_PATH).matchBody(body => {
    let fahrenheitToCelsius = getSOAPActionData('FahrenheitToCelsius', body);

    return fahrenheitToCelsius != null;
}).replyBody(_body => {
    return readBodyFile('./W3Schools/TempConvert/FahrenheitToCelsius/reply.xml')
}).build();
