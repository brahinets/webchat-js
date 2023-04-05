export class Participant {
    readonly id: UserID;
    readonly name: string;

    constructor(id: UserID, name: string) {
        this.id = id;
        this.name = name;
    }
}

export type UserID = string;