import * as fs from 'fs';

interface QOTDInterface {
    userID: string;
    content: string,
    approvalMessageId: string
}

interface QOTDConfigInterface {
    suggestions: QOTDInterface[];
    approvedQOTDs: QOTDInterface[];
}

let qotds: QOTDConfigInterface = require('./qotd.json');

export function addQOTD(qotd: string, user: any, approvalMessageId: string) {
    qotds.suggestions.push({
        userID: user.id,
        content: qotd,
        approvalMessageId: approvalMessageId
    });

    fs.writeFileSync('./qotd.json', JSON.stringify(qotds, null, 4));
}

export function approveQOTD(approvalMessageID) {
    qotds.suggestions.forEach((qotd, index) => {
        if (qotd.approvalMessageId === approvalMessageID) {
            qotds.approvedQOTDs.push(qotd);
            qotds.suggestions.splice(index, 1);
        }
    });
}
