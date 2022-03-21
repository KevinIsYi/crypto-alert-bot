import express, { Request, Response } from 'express';
import { CryptoAlertInterface } from '../interfaces/interfaces';
import { CryptosService } from './CryptosService';
import { TelegramBotService } from './TelegramBotService';

export class MainService {
	private telegramBot = new TelegramBotService();
	private cryptosService = new CryptosService(this.sendAlert);
	private app = express();
	private port = process.env.PORT || 8080;

	public start() {
		this.middlewares();
		this.routes();
		this.telegramBot.run();
		this.cryptosService.run();
	}

	private middlewares() {
		this.app.listen(this.port, () => {
			console.log(`Listening on port: ${this.port}`);
		});
	}

	private sendAlert(alertData: CryptoAlertInterface) {
		console.log("Alertar", alertData);
		console.log(this.telegramBot);
		
		
		this.telegramBot.alertUsers(alertData);
	}

	private routes() {
		this.app.get('/', (req: Request, res: Response) => {
			return res.send(
				"Hi! I'm CryptoPumpAlert. Talk to me on telegram: @CryptoPumpuAlert (Yes, there is a typo. Shut up)"
			);
		});
	}
}
