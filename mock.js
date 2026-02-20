import nock from 'nock';

import { baseUrl } from './proxy.js';

export {
    mockPath,
    mock,
};

const mockPath = process.env.MOCK_PATH || 'mock';

function mock(name, verb, path) {
    function matchHeadersSafe(name, func) {
        const matchHeadersSafeFunc = () => {
            let matchHeaders = {};

            try {
                matchHeaders = func();
            } catch (error) {
                console.error('Mock %s, match headers func error: %s', name, error);
            }

            return matchHeaders;
        };

        return matchHeadersSafeFunc;
    }

    function matchBodySafe(name, func) {
        const matchBodySafeFunc = (body) => {
            let matchBody = true;

            try {
                matchBody = func(body);
            } catch (error) {
                console.error('Mock %s, match body func error: %s', name, error);
            }

            return matchBody;
        };

        return matchBodySafeFunc;
    }

    function replyStatusSafe(name, func) {
        const replyStatusSafeFunc = () => {
            let replyStatus = 200;

            try {
                replyStatus = func();
            } catch (error) {
                console.error('Mock %s, reply status func error: %s', name, error);
            }

            return replyStatus;
        };

        return replyStatusSafeFunc;
    }

    function replyHeadersSafe(name, func) {
        const replyHeadersSafeFunc = () => {
            let replyHeaders = {};

            try {
                replyHeaders = func();
            } catch (error) {
                console.error('Mock %s, reply headers func error: %s', name, error);
            }

            return replyHeaders;
        };

        return replyHeadersSafeFunc;
    }

    function replyBodySafe(name, func) {
        const replyBodySafeFunc = (body) => {
            let replyBody = '';

            try {
                replyBody = func(body);
            } catch (error) {
                console.error('Mock %s, reply body func error: %s', name, error);
            }

            return replyBody;
        };

        return replyBodySafeFunc;
    }

    const mock = {
        matchHeadersFunc: () => ({}),
        matchBodyFunc: (body) => true,
        replyStatusFunc: () => 200,
        replyHeadersFunc: () => ({}),
        replyBodyFunc: (body) => '',
        _scope: null,

        matchHeaders(func) {
            this.matchHeadersFunc = func;

            return this;
        },

        matchBody(func) {
            this.matchBodyFunc = func;

            return this;
        },

        replyStatus(func) {
            this.replyStatusFunc = func;

            return this;
        },

        replyHeaders(func) {
            this.replyHeadersFunc = func;

            return this;
        },

        replyBody(func) {
            this.replyBodyFunc = func;

            return this;
        },

        build() {
            this._scope = nock(baseUrl, { allowUnmocked: true, badheaders: ['X-Mock-Skip'], reqheaders: matchHeadersSafe(name, this.matchHeadersFunc)() })
                .persist()
                .defaultReplyHeaders({ 'X-Mock-Name': name })
                .intercept(path, verb, body => matchBodySafe(name, this.matchBodyFunc)(body))
                .reply(replyStatusSafe(name, this.replyStatusFunc)(), (_uri, body) => replyBodySafe(name, this.replyBodyFunc)(body), replyHeadersSafe(name, this.replyHeadersFunc)());

            return this;
        },
    };

    return mock;
};
