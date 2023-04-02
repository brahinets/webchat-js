import express from 'express';

const app: express = express()

app.use(express.static('chat/public'))

const port: number = 3000;
app.listen(port, (): void => {
    console.log(`Server started on port ${port}`);
});