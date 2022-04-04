export interface QOTDFileInterface {
    suggestions: QOTDInterface[];
    approvedQOTDs: QOTDInterface[];
}

export interface QOTDInterface {
    content: string,
    userID: string,
    approvalMessageId: string
}