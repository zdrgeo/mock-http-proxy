import nock from 'nock';

export {
    mockPath,
    mock,
};

const mockPath = process.env.MOCK_PATH || 'mock';

function mock(name, baseUrl, path) {
    function matchBodySafe(name, func) {
        const matchBodySafeFunc = (body) => {
            let matchBody = false;

            try {
                matchBody = func(body);
            } catch (error) {
                matchBody = false;

                console.error('Mock %s, match body func error: %s', name, error);
            }

            return matchBody;
        };

        return matchBodySafeFunc;
    }

    function replyBodySafe(name, func) {
        const replyBodySafeFunc = (body) => {
            let replyBody = '';

            try {
                replyBody = func(body);
            } catch (error) {
                replyBody = `Mock ${name}, reply body func error: ${error}`;

                console.error('Mock %s, reply body func error: %s', name, error);
            }

            return replyBody;
        };

        return replyBodySafeFunc;
    }

    const mock = {
        matchBodyFunc: (body) => false,
        replyBodyFunc: (body) => '',
        _scope: null,

        matchBody(func) {
            this.matchBodyFunc = func;

            return this;
        },

        replyBody(func) {
            this.replyBodyFunc = func;

            return this;
        },

        build() {
            this._scope = nock(baseUrl, { allowUnmocked: true, badheaders: ['X-Mock-Skip'] })
                .persist()
                .post(path, body => matchBodySafe(name, this.matchBodyFunc)(body))
                .reply(200, (_uri, body) => replyBodySafe(name, this.replyBodyFunc)(body), { 'X-Mock-Name': name });

            return this;
        },
    };

    return mock;
};
