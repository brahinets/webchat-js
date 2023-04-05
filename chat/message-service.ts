import {Message, MessageID} from "./message";

export class MessageRepository {
    private messages: Message[] = [];

    addMessage(message: Message): void {
        this.messages.push(message);
    }

    getAllMessages(): Message[] {
        return this.messages;
    }

    deleteMessage(id: MessageID): boolean {
        // todo add security check for message ownership
        for (let i: number = 0; i < this.messages.length; i++) {
            if (id === this.messages[i].id) {
                this.messages.splice(i, 1);
                return true;
            }
        }

        return false;
    }
}