import fs from 'fs';

let config = require('./config.json');

export function writeConfig(config: any) {
    fs.writeFileSync('./config.json', JSON.stringify(config, null, 4));
}

export function readConfig() {
    config = require('./config.json');
    return config;
}