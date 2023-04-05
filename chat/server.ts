import express from 'express'
import bodyParser from 'body-parser'
import {ChatService, Participant} from "./chat-service";
import {Message, MessageDto} from "./message";


const app: express = express()
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static('chat/public'))


const clientsMessageMap: Map<Participant, express.Response> = new Map<Participant, express.Response>();
const clientsDeleteMap: Map<Participant, express.Response> = new Map<Participant, express.Response>();

const chatService: ChatService = new ChatService();

app.get('/join', (req, res): void => {
    let participant: Participant = chatService.registerUser();

    res.json(participant);
});

app.get('/listen-messages', (req: express.Request, res: express.Response): void => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    const id: string = req.query.clientID;
    const participant: Participant = chatService.userById(id);
    if (participant === undefined) {
        return;
    }

    clientsMessageMap.set(participant, res);

    chatService.getAllMessages().forEach((message: Message) => {
        res.write('data: ' + JSON.stringify(toMessageDto(message)) + '\n\n');
    });

    clientsMessageMap.forEach((clientConnection: express.Response, targetParticipant: Participant): void => {
        console.log(`Broadcasting message to ${targetParticipant.id}`)
        clientConnection.write('data: ' + JSON.stringify(toMessageDto(
            new Message(participant.id, "has joined char"))
        ) + '\n\n');
    });

    req.on('close', (): void => {
        clientsMessageMap.delete(participant);
    });
})

app.get('/listen-delete', (req: express.Request, res: express.Response): void => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    const id: string = req.query.clientID;
    const participant: Participant = chatService.userById(id);
    if (participant === undefined) {
        return;
    }

    clientsDeleteMap.set(participant, res);

    req.on('close', (): void => {
        clientsDeleteMap.delete(participant);
    });
});


app.post('/message', (req, res): void => {
    const message = JSON.parse(req.body);

    const messageData: Message = new Message(message.clientID, message.message);
    chatService.addMessage(messageData)

    clientsMessageMap.forEach((clientConnection: express.Response, participant: Participant): void => {
        console.log(`Broadcasting message to ${participant.id}`)
        clientConnection.write('data: ' + JSON.stringify(toMessageDto(messageData)) + '\n\n');
    });

    res.sendStatus(200);
});

app.delete('/message', (req, res): void => {
    const deleteCommand = JSON.parse(req.body);

    let deletedMessage: boolean = chatService.deleteMessage(deleteCommand.messageID);

    if (deletedMessage) {
        clientsDeleteMap.forEach((clientConnection: express.Response, participant: Participant): void => {
            console.log(`Broadcasting message delete to ${participant.id}`)
            clientConnection.write('data: ' + JSON.stringify({messageID: deleteCommand.messageID}) + '\n\n');
        });
    }

    res.sendStatus(200);
});

function toMessageDto(message: Message): MessageDto {
    const author: Participant = chatService.userById(message.authorID);
    return new MessageDto(author.id, author.name, message.text, message.id);
}

const port: number = 3000;

app.listen(port, (): void => {
    console.log(`Server started on port ${port}`);
});