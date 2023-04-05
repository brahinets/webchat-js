import {v4 as uuidv4} from 'uuid';

export class Message {
    readonly authorID: string;
    readonly text: string;
    readonly id: string;

    constructor(authorID: string, message: string) {
        this.id = uuidv4();
        this.authorID = authorID;
        this.text = message;
    }
}

export class MessageDto {
    readonly authorID: string;
    readonly authorName: string;
    readonly text: string;
    readonly id: string;

    constructor(authorID: string, authorName: string, message: string, messageID: string) {
        this.authorID = authorID;
        this.authorName = authorName;
        this.text = message;
        this.id = messageID;
    }
}