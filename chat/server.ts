import express from 'express'
import bodyParser from 'body-parser'
import {ChatService, Participant} from "./chat-service";


const app: express = express()
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static('chat/public'))


const clientsMap: Map<Participant, express.Response> = new Map<Participant, express.Response>();

const chatService: ChatService = new ChatService();

app.get('/register', (req: express.Request, res: express.Response): void => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    let participant: Participant = chatService.registerUser();
    clientsMap.set(participant, res);

    req.on('close', (): void => {
        clientsMap.delete(participant);
    });
});

app.post('/message', (req, res): void => {
    const message: string = req.body;

    clientsMap.forEach((clientConnection: express.Response, participant: Participant): void => {
        console.log(`Broadcasting message to ${participant.id}`)
        clientConnection.write('data: ' + JSON.stringify({
            clientID: participant.id,
            clientName: participant.name,
            message: message
        }) + '\n\n');
    });

    res.sendStatus(200);
});

const port: number = 3000;

app.listen(port, (): void => {
    console.log(`Server started on port ${port}`);
});