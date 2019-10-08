import React from 'react';
import get from 'lodash/get';
import {
    ArrayInput,
    BooleanField,
    BooleanInput,
    SimpleShowLayout,
    TextField,
    TextInput,
} from 'react-admin';
import { Card, CardContent, Grid } from '@material-ui/core';
import { CardFormIterator } from './CardFormIterator';

const MQTTSender = ({ dataObject }) => {
    const params_ext = Object.keys(dataObject[0]).filter(function(x) {
        return x.startsWith('ext_');
    });
    return (
        <div>
            <Grid container spacing={3}>
                {Object.keys(dataObject).map(i => (
                    <Grid item sm>
                        <Card key={i}>
                            <CardContent>
                                <SimpleShowLayout record={dataObject[i]}>
                                    {dataObject[i].hasOwnProperty(
                                        'destination_host'
                                    ) && (
                                        <TextField
                                            source="destination_host"
                                            label="Destination Host"
                                        />
                                    )}
                                    {dataObject[i].hasOwnProperty(
                                        'destination_port'
                                    ) && (
                                        <TextField
                                            source="destination_port"
                                            label="Destination Port"
                                        />
                                    )}
                                    {dataObject[i].hasOwnProperty(
                                        'broker_protocol'
                                    ) && (
                                        <TextField
                                            source="broker_protocol"
                                            label="Broker Protocol"
                                        />
                                    )}
                                    {dataObject[i].hasOwnProperty(
                                        'broker_authorization'
                                    ) && (
                                        <TextField
                                            source="broker_authorization"
                                            label="Broker Authorization"
                                        />
                                    )}
                                    {dataObject[i].hasOwnProperty(
                                        'broker_topic'
                                    ) && (
                                        <TextField
                                            source="broker_topic"
                                            label="Broker Topic"
                                        />
                                    )}
                                    {dataObject[i].hasOwnProperty(
                                        'connection_status_broker_topic'
                                    ) && (
                                        <TextField
                                            source="connection_status_broker_topic"
                                            label="Connection Status Broker Topic"
                                        />
                                    )}
                                    {params_ext.length !== 0 && <hr />}
                                    {params_ext.map(value => {
                                        return (
                                            <TextField
                                                record={dataObject[i]}
                                                source={`${value}`}
                                            />
                                        );
                                    })}
                                </SimpleShowLayout>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

const MQTTSenderEdit = ({ record }) => {
    const data = get(record, '$staged.transport_params');
    const uniqueKeys = Object.keys(
        data.reduce(function(result, obj) {
            return Object.assign(result, obj);
        }, {})
    );
    const params_ext = uniqueKeys.filter(function(x) {
        return x.startsWith('ext_');
    });
    return (
        <div>
            <ArrayInput
                label="Transport Parameters"
                source="$staged.transport_params"
            >
                <CardFormIterator disableRemove disableAdd>
                    <TextInput
                        source="destination_host"
                        label="Destination Host"
                    />
                    <TextInput
                        source="destination_port"
                        label="Destination Port"
                    />
                    <TextInput
                        source="broker_protocol"
                        label="Broker Protocol"
                    />
                    <TextInput
                        source="broker_authorization"
                        label="Broker Authorization"
                    />
                    <TextInput source="broker_topic" label="Broker Topic" />
                    <TextInput
                        source="connection_status_broker_topic"
                        label="Connection Status Broker Topic"
                    />
                    {params_ext.length !== 0 && <hr />}
                    {params_ext.map(value => {
                        return (
                            <TextInput record={record} source={`${value}`} />
                        );
                    })}
                </CardFormIterator>
            </ArrayInput>
        </div>
    );
};

const RTPSender = ({ dataObject }) => {
    const params_ext = Object.keys(dataObject[0]).filter(function(x) {
        return x.startsWith('ext_');
    });
    return (
        <div>
            <Grid container spacing={3}>
                {Object.keys(dataObject).map(i => (
                    <Grid item sm>
                        <Card key={i}>
                            <CardContent>
                                <SimpleShowLayout record={dataObject[i]}>
                                    {dataObject[i].hasOwnProperty(
                                        'rtp_enabled'
                                    ) && (
                                        <BooleanField
                                            source="rtp_enabled"
                                            label="RTP Enabled"
                                        />
                                    )}
                                    {dataObject[i].hasOwnProperty(
                                        'source_ip'
                                    ) && (
                                        <TextField
                                            source="source_ip"
                                            label="Source IP"
                                        />
                                    )}
                                    {dataObject[i].hasOwnProperty(
                                        'destination_ip'
                                    ) && (
                                        <TextField
                                            source="destination_ip"
                                            label="Destination IP"
                                        />
                                    )}
                                    {dataObject[i].hasOwnProperty(
                                        'source_port'
                                    ) && (
                                        <TextField
                                            source="source_port"
                                            label="Source Port"
                                        />
                                    )}
                                    {dataObject[i].hasOwnProperty(
                                        'destination_port'
                                    ) && (
                                        <TextField
                                            source="destination_port"
                                            label="Destination Port"
                                        />
                                    )}
                                    {dataObject[i].hasOwnProperty(
                                        'fec_enabled'
                                    ) && <hr /> && (
                                            <BooleanField
                                                source="fec_enabled"
                                                label="FEC Enabled"
                                            />
                                        )}
                                    {dataObject[i].hasOwnProperty(
                                        'fec_destination_ip'
                                    ) && (
                                        <TextField
                                            source="fec_destination_ip"
                                            label="FEC Destination IP"
                                        />
                                    )}
                                    {dataObject[i].hasOwnProperty(
                                        'fec_type'
                                    ) && (
                                        <TextField
                                            source="fec_type"
                                            label="FEC Type"
                                        />
                                    )}
                                    {dataObject[i].hasOwnProperty(
                                        'fec_mode'
                                    ) && (
                                        <TextField
                                            source="fec_mode"
                                            label="FEC Mode"
                                        />
                                    )}
                                    {dataObject[i].hasOwnProperty(
                                        'fec_block_width'
                                    ) && (
                                        <TextField
                                            source="fec_block_width"
                                            label="FEC Block Width"
                                        />
                                    )}
                                    {dataObject[i].hasOwnProperty(
                                        'fec_block_height'
                                    ) && (
                                        <TextField
                                            source="fec_block_height"
                                            label="FEC Block Height"
                                        />
                                    )}
                                    {dataObject[i].hasOwnProperty(
                                        'fec1D_destination_port'
                                    ) && (
                                        <TextField
                                            source="fec1D_destination_port"
                                            label="FEC1D Destination Port"
                                        />
                                    )}
                                    {dataObject[i].hasOwnProperty(
                                        'fec2D_destination_port'
                                    ) && (
                                        <TextField
                                            source="fec2D_destination_port"
                                            label="FEC2D Destination Port"
                                        />
                                    )}
                                    {dataObject[i].hasOwnProperty(
                                        'fec1D_source_port'
                                    ) && (
                                        <TextField
                                            source="fec1D_source_port"
                                            label="FEC1D source Port"
                                        />
                                    )}
                                    {dataObject[i].hasOwnProperty(
                                        'fec2D_source_port'
                                    ) && (
                                        <TextField
                                            source="fec2D_source_port"
                                            label="FEC2D Source Port"
                                        />
                                    )}
                                    {dataObject[i].hasOwnProperty(
                                        'rtcp_enabled'
                                    ) && <hr /> && (
                                            <BooleanField
                                                source="rtcp_enabled"
                                                label="RTCP Enabled"
                                            />
                                        )}
                                    {dataObject[i].hasOwnProperty(
                                        'rtcp_destination_ip'
                                    ) && (
                                        <TextField
                                            source="rtcp_destination_ip"
                                            label="RTCP Destination IP"
                                        />
                                    )}
                                    {dataObject[i].hasOwnProperty(
                                        'rtcp_destination_port'
                                    ) && (
                                        <TextField
                                            source="rtcp_destination_port"
                                            label="RTCP Destination Port"
                                        />
                                    )}
                                    {dataObject[i].hasOwnProperty(
                                        'rtcp_source_port'
                                    ) && (
                                        <TextField
                                            source="rtcp_source_port"
                                            label="RTCP Source Port"
                                        />
                                    )}
                                    {params_ext.length !== 0 && <hr />}
                                    {params_ext.map(value => {
                                        return (
                                            <TextField
                                                record={dataObject[i]}
                                                source={`${value}`}
                                            />
                                        );
                                    })}
                                </SimpleShowLayout>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

const RTPSenderEdit = ({ record }) => {
    const data = get(record, '$staged.transport_params');
    const uniqueKeys = Object.keys(
        data.reduce(function(result, obj) {
            return Object.assign(result, obj);
        }, {})
    );
    const params_ext = uniqueKeys.filter(function(x) {
        return x.startsWith('ext_');
    });
    return (
        <div>
            <ArrayInput
                label="Transport Parameters"
                source="$staged.transport_params"
            >
                <CardFormIterator disableRemove disableAdd>
                    <BooleanInput source="rtp_enabled" label="RTP Enabled" />
                    <TextInput source="source_ip" label="Source IP" />
                    <TextInput source="destination_ip" label="Destination IP" />
                    <TextInput source="source_port" label="Source Port" />
                    <TextInput
                        source="destination_port"
                        label="Destination Port"
                    />
                    <BooleanInput source="fec_enabled" label="FEC Enabled" />
                    <TextInput
                        source="fec_destination_ip"
                        label="FEC Destination IP"
                    />
                    <TextInput source="fec_type" label="FEC Type" />
                    <TextInput source="fec_mode" label="FEC Mode" />
                    <TextInput
                        source="fec_block_width"
                        label="FEC Block Width"
                    />
                    <TextInput
                        source="fec_block_height"
                        label="FEC Block Height"
                    />
                    <TextInput
                        source="fec1D_destination_port"
                        label="FEC1D Destination Port"
                    />
                    <TextInput
                        source="fec2D_destination_port"
                        label="FEC2D Destination Port"
                    />
                    <TextInput
                        source="fec1D_source_port"
                        label="FEC1D Source Port"
                    />
                    <TextInput
                        source="fec2D_source_port"
                        label="FEC2D Source Port"
                    />
                    <BooleanInput source="rtcp_enabled" label="RTCP Enabled" />
                    <TextInput
                        source="rtcp_destination_ip"
                        label="RTCP Destination IP"
                    />
                    <TextInput
                        source="rtcp_destination_port"
                        label="RTCP Destination Port"
                    />
                    <TextInput
                        source="rtcp_source_port"
                        label="RTCP Source Port"
                    />
                    {params_ext.length !== 0 && <hr />}
                    {params_ext.map(value => {
                        return (
                            <TextInput record={record} source={`${value}`} />
                        );
                    })}
                </CardFormIterator>
            </ArrayInput>
        </div>
    );
};

const WebSocketSender = ({ dataObject }) => {
    const params_ext = Object.keys(dataObject[0]).filter(function(x) {
        return x.startsWith('ext_');
    });
    return (
        <div>
            <Grid container spacing={3}>
                {Object.keys(dataObject).map(i => (
                    <Grid item sm>
                        <Card key={i}>
                            <CardContent>
                                <SimpleShowLayout record={dataObject[i]}>
                                    {dataObject[i].hasOwnProperty(
                                        'connection_authorization'
                                    ) && (
                                        <BooleanField
                                            source="connection_authorization"
                                            label="Connection Authorization"
                                        />
                                    )}
                                    {dataObject[i].hasOwnProperty(
                                        'connection_uri'
                                    ) && (
                                        <TextField
                                            source="connection_uri"
                                            label="Connection URI"
                                        />
                                    )}
                                    {params_ext.length !== 0 && <hr />}
                                    {params_ext.map(value => {
                                        return (
                                            <TextField
                                                record={dataObject[i]}
                                                source={`${value}`}
                                            />
                                        );
                                    })}
                                </SimpleShowLayout>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

const WebSocketSenderEdit = ({ record }) => {
    const data = get(record, '$staged.transport_params');
    const uniqueKeys = Object.keys(
        data.reduce(function(result, obj) {
            return Object.assign(result, obj);
        }, {})
    );
    const params_ext = uniqueKeys.filter(function(x) {
        return x.startsWith('ext_');
    });
    return (
        <div>
            <ArrayInput
                label="Transport Parameters"
                source="$staged.transport_params"
            >
                <CardFormIterator disableRemove disableAdd>
                    <BooleanInput
                        source="connection_authorization"
                        label="Connection Authorization"
                    />
                    <TextInput source="connection_uri" label="Connection URI" />
                    {params_ext.length !== 0 && <hr />}
                    {params_ext.map(value => {
                        return (
                            <TextInput record={record} source={`${value}`} />
                        );
                    })}
                </CardFormIterator>
            </ArrayInput>
        </div>
    );
};

const SenderTransportParamsCardsGrid = ({ ids, record }) => {
    const type = get(record, '$transporttype');
    const dataObject = [];
    if (ids) {
        for (let i in ids) {
            dataObject.push(JSON.parse(ids[i]));
        }
        switch (type) {
            case 'urn:x-nmos:transport:mqtt':
                return <MQTTSender dataObject={dataObject} />;
            case 'urn:x-nmos:transport:rtp':
                return <RTPSender dataObject={dataObject} />;
            case 'urn:x-nmos:transport:websocket':
                return <WebSocketSender dataObject={dataObject} />;
            default:
                return <b>Unknown Type</b>;
        }
    } else {
        switch (type) {
            case 'urn:x-nmos:transport:mqtt':
                return <MQTTSenderEdit record={record} />;
            case 'urn:x-nmos:transport:rtp':
                return <RTPSenderEdit record={record} />;
            case 'urn:x-nmos:transport:websocket':
                return <WebSocketSenderEdit record={record} />;
            default:
                return <b>Unknown Type</b>;
        }
    }
};

export default SenderTransportParamsCardsGrid;
