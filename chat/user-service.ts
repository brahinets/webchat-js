import {Participant} from "./participant";
import {adjectives, starWars, uniqueNamesGenerator} from "unique-names-generator";
import {v4 as uuidv4} from 'uuid';

export class UserRepository {
    private readonly participants: Participant[] = [];

    registerUser(): Participant {
        let participant: Participant = new Participant(uuidv4(), this.generateName());

        this.participants.push(participant);

        return participant;
    }

    userById(id: string): Participant {
        return this.participants.find((p: Participant): boolean => p.id === id);
    }

    private generateName(): string {
        return uniqueNamesGenerator({
            dictionaries: [adjectives, starWars],
            separator: " ",
            style: "capital"
        });
    }
}