import {UserRepository} from "./user-service";
import {MessageRepository} from "./message-service";
import {Participant, UserID} from "./participant";
import {Message, MessageID} from "./message";

export class ChatService {
    private readonly messageRepository: MessageRepository;
    private readonly userRepository: UserRepository;

    constructor(userRepository: UserRepository, messageRepository: MessageRepository) {
        this.userRepository = userRepository;
        this.messageRepository = messageRepository;
    }

    findParticipant(id: UserID): Participant {
        return this.userRepository.userById(id);
    }

    registerParticipant(): Participant {
        return this.userRepository.registerUser();
    }

    getAllMessages(): Message[] {
        return this.messageRepository.getAllMessages();
    }

    sendMessage(message: Message): void {
        this.messageRepository.addMessage(message);
    }

    deleteMessage(id: MessageID): boolean {
        return this.messageRepository.deleteMessage(id);
    }
}

