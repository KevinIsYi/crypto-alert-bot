import TelegramBot from 'node-telegram-bot-api';
import {
	ANGRY_MESSAGE_LEVEL_1,
	ANGRY_MESSAGE_LEVEL_2,
	ANGRY_MESSAGE_LEVEL_3,
	BLOCK_USER_MESSAGE_RESPONSE,
} from '../constants/constants';
import { CryptoAlertInterface } from '../interfaces/interfaces';
import { UserPool } from './UserPool';

const IS_NEW_USER = 0;

export class TelegramBotService {
	private token = process.env.TELEGRAM_TOKEN;
	private bot = new TelegramBot(this.token!, { polling: true });
	private userPool = new UserPool();
	private angryMessages = [
		ANGRY_MESSAGE_LEVEL_1,
		ANGRY_MESSAGE_LEVEL_2,
		ANGRY_MESSAGE_LEVEL_3,
	];

	public run() {
		this.bot.on('message', (message) => {
			const {
				chat: { id: telegramID },
			} = message;
			const user = this.userPool.handleUserMessage(telegramID);

			if (user.isUserOK) {
				const { numberOfAlerts } = user;

				if (numberOfAlerts === IS_NEW_USER) {
					this.welcomeUser(telegramID);
				} else {
					this.roastUser(telegramID, numberOfAlerts - 1);
				}
			} else {
				this.doNotTalkToYouMessage(telegramID);
			}
		});
	}

	private welcomeUser(chatId: number) {
		this.bot.sendMessage(
			chatId,
			`Hey! I don't know how you are or what you want. But I like you, just for being here with me. Starting... 😉`
		);
		this.bot.sendMessage(chatId, "Ok... I'm already working 😁");
		this.bot.sendMessage(
			chatId,
			"Quick heads up, I am pretty basic right now, but I'll get smarter as time goes... 😏"
		);
		this.bot.sendMessage(
			chatId,
			"FYI... I'm pretty sensitive, so... Between you and me, I'll do the talking. Wich means... DO NOT TALK TO ME AGAIN! 😡"
		);
		this.bot.sendMessage(
			chatId,
			"Next time you here about me, I'll bring a signal. Enjoy 😌"
		);
	}

	private roastUser(chatId: number, numberOfAlerts: number) {
		this.bot.sendMessage(chatId, this.angryMessages[numberOfAlerts]);
	}

	private doNotTalkToYouMessage(chatId: number) {
		this.bot.sendMessage(chatId, BLOCK_USER_MESSAGE_RESPONSE);
	}

	public alertUsers({
		symbol,
		prevPrice,
		currentPrice,
		diffMins,
		pricePercDiff,
	}: CryptoAlertInterface) {
		const users = this.userPool.getUsers();
		users.forEach((userTelegramID) => {
			this.bot.sendMessage(
				userTelegramID,
				`🚨🚨🚨 Price of: ${symbol.toUpperCase()} has changed from: ${prevPrice} to ${currentPrice} in ${diffMins} minutes. Wich is a difference of ${pricePercDiff} %. 🚨🚨🚨`
			);
		});
	}
}
