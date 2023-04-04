export class Message {
    readonly authorID: string;
    readonly text: string;

    constructor(authorID: string, message: string) {
        this.authorID = authorID;
        this.text = message;
    }
}

export class MessageDto {
    readonly authorID: string;
    readonly authorName: string;
    readonly text: string;

    constructor(authorID: string, authorName: string, message: string) {
        this.authorID = authorID;
        this.authorName = authorName;
        this.text = message;
    }
}