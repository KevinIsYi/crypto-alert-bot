import express, { Request, Response } from 'express';

export class ApiServer {
    private app = express();
    private port = process.env.PORT || 8080;

    public start() {
        this.middlewares();

        this.app.listen(this.port, () => {
            console.log(`Listening on port: ${this.port}`);
        });
    }

    private middlewares() {
        this.app.get("/", (req: Request, res: Response) => {
            return res.send("Hi! I'm CryptoPumpAlert. Talk to me on telegram: @CryptoPumpuAlert (Yes, there is a typo. Shut up)");
        });
    }
}