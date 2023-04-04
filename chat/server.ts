import express from 'express'
import bodyParser from 'body-parser'
import {ChatService, Participant} from "./chat-service";
import {Message} from "./message";


const app: express = express()
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static('chat/public'))


const clientsMap: Map<Participant, express.Response> = new Map<Participant, express.Response>();

const chatService: ChatService = new ChatService();

app.get('/join', (req, res): void => {
    let participant: Participant = chatService.registerUser();

    res.json(participant);
});

app.get('/register', (req: express.Request, res: express.Response): void => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    const id: string = req.query.clientID;
    const participant: Participant = chatService.userById(id);
    if(participant === undefined) {
        return;
    }

    clientsMap.set(participant, res);

    chatService.getAllMessages().forEach((message:Message) => {
        res.write('data: ' + JSON.stringify({
            authorID: message.authorID,
            authorName: chatService.userById(message.authorID).name,
            message: message.message
        }) + '\n\n');
    });

    clientsMap.forEach((clientConnection: express.Response, targetParticipant: Participant): void => {
        console.log(`Broadcasting message to ${targetParticipant.id}`)
        clientConnection.write('data: ' + JSON.stringify({
            authorName: participant.name,
            message: "has joined chat"
        }) + '\n\n');
    });

    req.on('close', (): void => {
        clientsMap.delete(participant);
    });
});

app.post('/message', (req, res): void => {
    const message = JSON.parse(req.body);

    let messageData:Message = new Message(message.clientID, message.message);
    chatService.addMessage(messageData)

    clientsMap.forEach((clientConnection: express.Response, participant: Participant): void => {
        console.log(`Broadcasting message to ${participant.id}`)
        const author: Participant = chatService.userById(messageData.authorID);

        clientConnection.write('data: ' + JSON.stringify({
            authorID: author.id,
            authorName: author.name,
            message: messageData.message
        }) + '\n\n');
    });

    res.sendStatus(200);
});

const port: number = 3000;

app.listen(port, (): void => {
    console.log(`Server started on port ${port}`);
});