import {adjectives, starWars, uniqueNamesGenerator} from "unique-names-generator";
import {v4 as uuidv4} from 'uuid';
import {Message} from "./message";

export class ChatService {
    private participants: Participant[] = [];
    private messages: Message[] = [];

    addMessage(message: Message): void {
        this.messages.push(message);
    }

    getAllMessages(): Message[] {
        return this.messages;
    }

    registerUser(): Participant {
        let participant: Participant = new Participant(uuidv4(), this.generateName());

        this.participants.push(participant);

        return participant;
    }

    userById(id: string): Participant {
        return this.participants.find((p: Participant):boolean => p.id === id);
    }

    private generateName(): string {
        return uniqueNamesGenerator({
            dictionaries: [adjectives, starWars],
            separator: " ",
            style: "capital"
        });
    }
}

export class Participant {
    readonly id: string;
    readonly name: string;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }
}