import express from 'express'
import bodyParser from 'body-parser'
import {v4 as uuidv4} from 'uuid';

const app: express = express()
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static('chat/public'))

const clientsMap: Map<string, express.Response> = new Map<string, express.Response>();

app.get('/register', (req: express.Request, res: express.Response): void => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    const clientID = uuidv4();
    clientsMap.set(clientID, res);

    req.on('close', (): void => {
        clientsMap.delete(clientID);
    });
});

app.post('/message', (req, res): void => {
    const message: string = req.body;

    clientsMap.forEach((clientConnection: express.Response, clientID: string): void => {
        console.log(`Broadcasting message to ${clientID}`)
        clientConnection.write(`data: ${message}\n\n`)
    });

    res.sendStatus(200);
});

const port: number = 3000;
app.listen(port, (): void => {
    console.log(`Server started on port ${port}`);
});