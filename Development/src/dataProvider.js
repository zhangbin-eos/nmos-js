import {
    CREATE,
    DELETE,
    GET_LIST,
    GET_MANY,
    GET_MANY_REFERENCE,
    GET_ONE,
    UPDATE,
    fetchUtils,
} from 'react-admin';
import get from 'lodash/get';
import pick from 'lodash/pick';
import assign from 'lodash/assign';
import diff from 'deep-diff';
import Cookies from 'universal-cookie';

let API_URL = '';

let LINK_HEADER = '';
const LOGGING_API = 'Logging API';
const QUERY_API = 'Query API';
const DNS_API = 'DNS-SD API';

const cookies = new Cookies();

function defaultUrl(api) {
    let path = window.location.protocol + '//' + window.location.host;
    switch (api) {
        case LOGGING_API:
            path += '/log/v1.0';
            return path;
        case QUERY_API:
            path += '/x-nmos/query/v1.2';
            return path;
        case DNS_API:
            path += '/x-dns-sd/v1.0';
            return path;
        default:
            //not expected to be used
            return '';
    }
}

function returnUrl(resource) {
    let url;
    let api;
    switch (resource) {
        case 'events':
            api = LOGGING_API;
            break;
        case 'queryapis':
            api = DNS_API;
            break;
        default:
            //all pages other than logs/queryapis
            api = QUERY_API;
            break;
    }
    if (cookies.get(api) === undefined) {
        url = defaultUrl(api);
    } else {
        url = cookies.get(api);
    }
    return url;
}

export const returnChangeQuery = (API, cookieQuery) => {
    if (cookieQuery === '' || cookieQuery === 'reset') {
        if (cookies.get(API) === undefined || cookieQuery === 'reset') {
            let local = defaultUrl(API);
            cookies.set(API, local, { path: '/' });
            return cookies.get(API);
        } else {
            return cookies.get(API);
        }
    } else {
        cookies.set(API, cookieQuery, { path: '/' });
        return cookies.get(API);
    }
};

export const queryRqlMode = whatMode => {
    cookies.set('RQL', whatMode, { path: '/' });
};

export const changePaging = newLimit => {
    let paging_limit = cookies.get('Paging Limit');
    if (newLimit === 'valueRequest') {
        if (paging_limit) {
            return paging_limit;
        }
        return 'Default';
    }
    paging_limit = newLimit;
    return paging_limit;
};

const convertDataProviderRequestToHTTP = (type, resource, params) => {
    switch (type) {
        case 'FIRST': {
            let m = LINK_HEADER.match(/<([^>]+)>;[ \t]*rel="first"/);
            return { url: m ? m[1] : null };
        }

        case 'LAST': {
            let m = LINK_HEADER.match(/<([^>]+)>;[ \t]*rel="last"/);
            return { url: m ? m[1] : null };
        }

        case 'NEXT': {
            let m = LINK_HEADER.match(/<([^>]+)>;[ \t]*rel="next"/);
            return { url: m ? m[1] : null };
        }

        case 'PREV': {
            let m = LINK_HEADER.match(/<([^>]+)>;[ \t]*rel="prev"/);
            return { url: m ? m[1] : null };
        }

        case GET_ONE: {
            API_URL = returnUrl(resource);
            if (resource === 'queryapis') {
                return { url: `${API_URL}/_nmos-query._tcp/${params.id}` };
            }
            return { url: `${API_URL}/${resource}/${params.id}` };
        }

        case GET_LIST: {
            const pagingLimit = cookies.get('Paging Limit');
            const queryParams = [];

            API_URL = returnUrl(resource);

            if (resource === 'queryapis') {
                return { url: `${API_URL}/_nmos-query._tcp/` };
            }

            if (cookies.get('RQL') === 'false') {
                for (const [key, value] of Object.entries(params.filter)) {
                    queryParams.push(key + '=' + value);
                }
            } else {
                const matchParams = [];
                for (const [key, value] of Object.entries(params.filter)) {
                    let parsedValue = encodeURIComponent(value);
                    parsedValue = parsedValue.split('%2C'); //splits comma separated values
                    for (let i = 0; i < parsedValue.length; i++) {
                        if (key === 'level') {
                            matchParams.push(
                                'eq(' + key + ',' + parsedValue[i] + ')'
                            );
                        } else {
                            //almost everything else is a string for which partial matches are useful
                            matchParams.push(
                                'matches(' +
                                    key +
                                    ',string:' +
                                    parsedValue[i] +
                                    ',i)'
                            );
                        }
                    }
                }
                const rqlFilter = matchParams.join(',');
                if (rqlFilter) {
                    queryParams.push('query.rql=and(' + rqlFilter + ')');
                }
            }

            if (pagingLimit && resource !== 'events') {
                queryParams.push(
                    'paging.order=update',
                    'paging.limit=' + pagingLimit
                );
            }

            const query = queryParams.join('&');
            return {
                url: `${API_URL}/${resource}?${query}`,
            };
        }
        case GET_MANY: {
            let total_query;
            if (cookies.get('RQL') !== 'false') {
                //!false is used as the initial no cookie state has the rql toggle in the enabled state
                total_query =
                    'query.rql=or(' +
                    params.ids.map(id => 'eq(id,' + id + ')').join(',') +
                    ')';
                return { url: `${API_URL}/${resource}?${total_query}` };
            } else {
                total_query = 'id=' + params.ids[0];
                //hmm, need to make multiple requests if we have to match one at a time with basic query syntax
                return { url: `${API_URL}/${resource}?${total_query}` };
            }
        }
        case GET_MANY_REFERENCE: {
            let total_query;
            if (params.target !== '' && params[params.source] !== '') {
                if (cookies.get('RQL') !== 'false') {
                    total_query =
                        'query.rql=matches(' +
                        params.target +
                        ',string:' +
                        params[params.source] +
                        ',i)';
                } else {
                    total_query = params.target + '=' + params[params.source];
                }
                total_query += '&paging.limit=1000';
                return { url: `${API_URL}/${resource}?${total_query}` };
            } else {
                return { url: `${API_URL}/${resource}` };
            }
        }
        case UPDATE:
            let patchData = pick(get(params, 'data.$staged'), [
                'master_enable',
                'activation.mode',
                'activation.requested_time',
            ]);
            switch (resource) {
                case 'receivers':
                    assign(patchData, {
                        sender_id: get(params, 'data.$staged.sender_id'),
                    });
                    break;
                case 'senders':
                    assign(patchData, {
                        receiver_id: get(params, 'data.$staged.receiver_id'),
                    });
                    break;
                default:
                    break;
            }
            const differences = diff(
                get(params, 'previousData.$staged.transport_params'),
                get(params, 'data.$staged.transport_params')
            );
            if (differences) {
                let transport_params = Array(
                    get(params, 'data.$staged.transport_params').length
                ).fill({});
                for (const d of differences) {
                    if (d.kind !== 'N')
                        transport_params[d.path[0]] = assign(
                            {},
                            { [d.path[1]]: d.rhs }
                        );
                }
                assign(patchData, { transport_params });
            }
            if (
                get(params, 'previousData.$staged.transport_file.data') !==
                get(params, 'data.$staged.transport_file.data')
            ) {
                if (get(params.data, '$staged.transport_file.data')) {
                    assign(patchData, {
                        transport_file: {
                            data: get(
                                params.data,
                                '$staged.transport_file.data'
                            ),
                            type: 'application/sdp',
                        },
                    });
                } else {
                    assign(patchData, {
                        transport_file: {
                            data: null,
                            type: null,
                        },
                    });
                }
            }

            const options = {
                method: 'PATCH',
                body: JSON.stringify(patchData),
            };
            return {
                url: `${params.data.$connectionAPI}/single/${resource}/${params.data.id}/staged`,
                options: options,
            };
        case CREATE:
            return '';
        case DELETE:
            return '';
        default:
            //not expected to be used
            return '';
    }
};

async function getEndpoints(json, resource, connectionAddress, params) {
    const endpoints = {
        receivers: ['active', 'constraints', 'staged', 'transporttype'],
        senders: [
            'active',
            'constraints',
            'staged',
            'transporttype',
            'transportfile',
        ],
    };

    if (endpoints[resource].includes('transportfile')) {
        json['$transportfile'] = await fetch(
            `${connectionAddress}/single/senders/${params.id}/transportfile/`,
            {
                headers: {
                    Accept: 'application/sdp',
                },
            }
        ).then(function(response) {
            return response.text();
        });
        endpoints[resource] = endpoints[resource].filter(
            item => item !== 'transportfile'
        );
    }

    const connectionAPIVersion = connectionAddress.split('/').pop();
    if (connectionAPIVersion.startsWith('v1.0')) {
        endpoints[resource] = endpoints[resource].filter(
            item => item !== 'transporttype'
        );
        json.$transporttype = 'urn:x-nmos:transport:rtp';
    }

    for (let i in endpoints[resource]) {
        json['$' + endpoints[resource][i]] = await fetch(
            `${connectionAddress}/single/${resource}/${params.id}/${endpoints[resource][i]}/`
        ).then(result => result.json());
    }
}

async function convertHTTPResponseToDataProvider(
    url,
    response,
    type,
    resource,
    params
) {
    const { headers, json } = response;
    LINK_HEADER = headers.get('Link');
    if (
        LINK_HEADER !== null &&
        LINK_HEADER.match(/<([^>]+)>;[ \t]*rel="next"/)
    ) {
        if (LINK_HEADER.match(/<([^>]+)>;[ \t]*rel="first"/)) {
            cookies.set('Pagination', 'enabled', { path: '/' });
        } else {
            cookies.set('Pagination', 'partial', { path: '/' });
        }
    } else {
        cookies.set('Pagination', 'disabled', { path: '/' });
    }
    switch (type) {
        case GET_ONE:
            if (resource === 'queryapis') {
                json.id = json.name;
            }
            if (resource === 'receivers' || resource === 'senders') {
                API_URL = returnUrl(resource);
                let resourceJSONData = await fetch(
                    `${API_URL}/${resource}/${params.id}`
                ).then(result => result.json());

                let deviceJSONData;
                if (resourceJSONData.hasOwnProperty('device_id')) {
                    API_URL = returnUrl('devices');
                    deviceJSONData = await fetch(
                        `${API_URL}/devices/${resourceJSONData.device_id}`
                    ).then(result => result.json());
                } else {
                    return { url: url, data: json };
                }

                let connectionAddresses = {};
                let connectionAddress;
                if (deviceJSONData.hasOwnProperty('controls')) {
                    for (let i in deviceJSONData.controls)
                        connectionAddresses[
                            deviceJSONData.controls[i]['type']
                        ] = deviceJSONData.controls[i]['href'];
                } else {
                    return { url: url, data: json };
                }
                connectionAddress =
                    connectionAddresses['urn:x-nmos:control:sr-ctrl/v1.1'] ||
                    connectionAddresses['urn:x-nmos:control:sr-ctrl/v1.0'];
                if (!connectionAddress) return { url: url, data: json };
                json.$connectionAPI = `${connectionAddress}`;

                await getEndpoints(json, resource, connectionAddress, params);
            }
            return { url: url, data: json };

        case GET_LIST:
            if (resource === 'queryapis') {
                json.map(_ => (_.id = _.name));
            }
            return {
                url: url,
                data: json,
                total: json ? json.length : 0,
            };
        case GET_MANY_REFERENCE:
            return {
                url: url,
                data: json,
                total: 'unknown',
            };
        case UPDATE:
            return { data: { ...json, id: json.id } };
        default:
            //used for prev, next, first, last
            if (resource === 'queryapis') {
                json.map(_ => (_.id = _.name));
            }
            return { url: url, data: json };
    }
}

export default async (type, resource, params) => {
    const { fetchJson } = fetchUtils;
    const { url, options } = convertDataProviderRequestToHTTP(
        type,
        resource,
        params
    );
    return fetchJson(url, options).then(
        response =>
            convertHTTPResponseToDataProvider(
                url,
                response,
                type,
                resource,
                params
            ),
        response => {
            return Promise.reject(
                new Error(
                    `${response.body.error} - ${response.body.code} - (${response.body.debug})`
                )
            );
        }
    );
};
