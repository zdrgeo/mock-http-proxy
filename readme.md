# Mock HTTP Proxy

## Overview

This is an example of how [Express](https://github.com/expressjs/express) and [Nock](https://github.com/nock/nock) can be used to create a simple HTTP proxy that can mock the responses to specific HTTP requests. The proxy works with any HTTP-based protocol, but the example is limited to mocking HTTP message bodies only.

## Concepts

When started, the proxy first scans the specified mock directory for modules with mock definitions. Then, it starts listening for HTTP requests on the specified port. If the request matches a mock definition, the response is generated from the mock data. Otherwise, the request is forwarded to the base URL and the response is returned as is.

> [!NOTE]
> The mock definitions are cached. This means that, if a mock definition is changed, the proxy needs to be restarted for the changes to take effect.

A mock definition uses the mock builder API and has the following structure:

```javascript
// mock/mock-module.js

/**
 * Mocks an HTTP request to conditionally reply with generated response body.
 */
mock(/* Mock name (see also X-Mock-Name response header) */, /* URL path */).matchBody(body => {
    let matchBody = true /* Condition to check when inspecting the request body and deciding whether to respond with a generated response body */;

    return matchBody;
}).replyBody(body => {
    let replyBody = 'GENERATED' /* Generated response body */;

    return replyBody;
}).build();
```

Mocks are effective after the `build()` function is called. The `matchBody(func)` function is used to register a function that checks if the request body matches the condition. The `replyBody(func)` function is used to register a function that generates the response body.

> [!IMPORTANT]
> There are two HTTP headers that can be used to control or understand the behavior of the proxy:
> 
> `X-Mock-Skip` **request** header - Can be used to enable or disable the use of mocks per request/response cycle.
> 
> `X-Mock-Name` **response** header - Can be used to check whether the response is generated. Contains the name of the mock that generated the response.

> [!IMPORTANT]
> `mock/util` directory contains example utility functions that can be used in the mock definitions to inspect or generate the most common message bodies. For example, `json-util.js` and `soap-xml-util.js` contain functions to extract data from JSON and SOAP XML bodies, `template-body-file-util.js` contains functions to generate a body from an EJS template file.

## Examples

Mocks [W3Schools TempConvert CelsiusToFahrenheit](https://www.w3schools.com/xml/tempconvert.asmx?op=CelsiusToFahrenheit) SOAP action to reply with response generated from [EJS](https://github.com/mde/ejs) template. The mock is effective only if the temperature in the request is above 20 degree Celsius. SOAP action body is passed to the [EJS](https://github.com/mde/ejs) template to generate a response with a random value for CelsiusToFahrenheitResult field.

```javascript
// mock/w3schools-tempconvert.js

const TEMPCONVERT_PATH = '/xml/tempconvert.asmx';

/**
 * Mocks CelsiusToFahrenheit SOAP action to reply from EJS template file.
 */
mock('W3Schools_TempConvert_CelsiusToFahrenheit', TEMPCONVERT_PATH).matchBody(body => {
    let celsiusToFahrenheit = getSOAPActionData('CelsiusToFahrenheit', body);

    return celsiusToFahrenheit?.Celsius > 20;
}).replyBody(body => {
    let celsiusToFahrenheit = getSOAPActionData('CelsiusToFahrenheit', body);

    return readTemplateBodyFile('./W3Schools/TempConvert/CelsiusToFahrenheit/reply.ejs', celsiusToFahrenheit);
}).build();
```

```xml
<!-- mock/W3Schools/TempConvert/CelsiusToFahrenheit/reply.ejs -->
<%
  function randomTemp(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);

    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
  }
%>
<?xml version="1.0" encoding="utf-8"?>
<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
  <soap12:Body>
    <CelsiusToFahrenheitResponse xmlns="https://www.w3schools.com/xml/">
      <CelsiusToFahrenheitResult><%= data.Celsius + randomTemp(20, 40) %></CelsiusToFahrenheitResult>
    </CelsiusToFahrenheitResponse>
  </soap12:Body>
</soap12:Envelope>
```

## Quickstart

### Configuration

The base URL and the mock directory are specified as environment variables.

```dotenv
# .env

PORT=3000
BASE_URL=https://www.w3schools.com
MOCK_PATH=mock
```

### Node

```shell
npm install

npm run start
```

### Docker

Build on _Windows and Linux_

```shell
docker build mock-http-proxy:latest .
```

Run on _Windows_

```shell
docker run --env-file ./.env -it --rm -p 3000:3000 -v ${PWD}/mock:/mock-http-proxy/mock scaleforce.azurecr.io/mock-http-proxy:latest
```

Run on _Linux_

```shell
docker run --env-file ./.env -it --rm -p 3000:3000 -v $(pwd)/mock:/mock-http-proxy/mock scaleforce.azurecr.io/mock-http-proxy:latest
```
