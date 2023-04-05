import {v4 as uuidv4} from 'uuid';
import {UserID} from "./participant";

export class Message {
    readonly authorID: UserID;
    readonly text: string;
    readonly id: MessageID;

    constructor(authorID: UserID, message: string) {
        this.id = uuidv4();
        this.authorID = authorID;
        this.text = message;
    }
}

export class MessageDto {
    readonly authorID: UserID;
    readonly authorName: string;
    readonly text: string;
    readonly id: MessageID;

    constructor(authorID: UserID, authorName: string, message: string, messageID: MessageID) {
        this.authorID = authorID;
        this.authorName = authorName;
        this.text = message;
        this.id = messageID;
    }
}

export type MessageID = string;
