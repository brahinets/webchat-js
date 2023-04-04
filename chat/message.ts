export class Message {
    readonly authorID: string;
    readonly message: string;

    constructor(authorID: string, message: string) {
        this.authorID = authorID;
        this.message = message;
    }
}