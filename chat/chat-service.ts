import {adjectives, starWars, uniqueNamesGenerator} from "unique-names-generator";
import {v4 as uuidv4} from 'uuid';

export class ChatService {
    private participants: Participant[] = [];

    registerUser(): Participant {
        let participant: Participant = new Participant(uuidv4(), this.generateName());

        this.participants.push(participant);

        return participant;
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