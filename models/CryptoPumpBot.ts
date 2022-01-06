import axios from "axios";
import TelegramBot from "node-telegram-bot-api";
import { CoinGeckoCryptoInfo, CoingeckoSymbols, CryptoInfo, TelegramManagmentUsers } from "../interfaces/interfaces";
import { CryptoInfoResponse } from "../types/types";
import { CryptoSymbols } from "./CryptoSymbols";

export class CryptoPumpBot {
    private cryptosInformation: CryptoInfo[] = [];
    private isProcessRunning = false;
    private availableCryptos: CoingeckoSymbols[] = [];
    private coingeckoBaseURL = "https://api.coingecko.com/api/v3/coins";
    private telegramUsers: any = {};
    private token = process.env.TELEGRAM_TOKEN;
    private bot = new TelegramBot(this.token!, { polling: true });
    private coingeckoCryptos = new CryptoSymbols();
    private angryMessages = ["Dafuq, bitch? I told you I'm working! 😡", "Ok... This is the last time I say this. DO NOT TALK TO ME! 😡😡😡", "Ok. That's it. I'm not joking. Bye."]

    constructor() {
        this.bot.on("message", (msg) => {
            const chatId = msg.chat.id;

            if (msg.text === process.env.STOP_BOT_MESSAGE) {
                this.stop();
            }
            else {
                if (this.telegramUsers[chatId]) {
                    const telegramUserInfo: TelegramManagmentUsers = this.telegramUsers[chatId];
                    const { isBlocked, numberOfAlerts, telegramChatId } = telegramUserInfo;

                    if (!isBlocked) {
                        this.bot.sendMessage(telegramChatId, `${this.angryMessages[numberOfAlerts]}, this is your ${numberOfAlerts + 1} strike`);
                        telegramUserInfo.numberOfAlerts++;

                        if (telegramUserInfo.numberOfAlerts === 3) {
                            telegramUserInfo.isBlocked = true;
                        }
                    }
                }
                else {
                    this.welcomeMessage(chatId);
                }
            }

        });

        this.start();
    }

    private welcomeMessage(chatId: number) {
        this.bot.sendMessage(chatId, `Hey! I don't know how you are or what you want. But I like you, just for being here with me. Starting... 😉`);
        this.bot.sendMessage(chatId, "Ok... I'm already working 😁");
        this.bot.sendMessage(chatId, "Quick heads up, I am pretty basic right now, but I'll get smarter as time goes... 😏");
        this.bot.sendMessage(chatId, "FYI... I'm pretty sensitive, so... Between you and me, I'll do the talking. Wich means... DO NOT TALK TO ME AGAIN! 😡");
        this.bot.sendMessage(chatId, "Next time you here about me, I'll bring a signal. Enjoy 😌");

        const newUser: TelegramManagmentUsers = {
            numberOfAlerts: 0,
            telegramChatId: chatId,
            isBlocked: false,
        }
        this.telegramUsers[chatId] = newUser;

    }

    private async sendAlert(symbol: string, prevPrice: number, currentPrice: number, diffMins: number, pricePercDiff: number) {
        for (const key in this.telegramUsers) {
            const { telegramChatId }: TelegramManagmentUsers = this.telegramUsers[key];

            this.bot.sendMessage(telegramChatId, `Price of: ${symbol.toUpperCase()} has changed from: ${prevPrice} to ${currentPrice} in ${diffMins} minutes`);
            this.bot.sendMessage(telegramChatId, `Difference: ${pricePercDiff} %`);
        }
    }


    private async checkCryptoChanges(crypto: CryptoInfo) {
        const { index, lastPrice: prevPrice, checkTime: lastChecktime } = crypto;

        const cryptoData = await this.getCryptoData(this.availableCryptos[index], index);

        if (cryptoData.ok) {
            const { data } = cryptoData;
            const { lastPrice: currentPrice, checkTime, symbol } = data;

            const pricePercDiff = (currentPrice * 100 / prevPrice) - 100;
            const diffMs = (checkTime - lastChecktime);
            const diffMins = Math.round(diffMs / 60000);

            this.cryptosInformation[index] = data;

            if (pricePercDiff >= 1) {
                this.sendAlert(symbol, prevPrice, currentPrice, diffMins, pricePercDiff);
            }
        }
    }

    private sleep(time: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    private async getCryptoData(crypto: CoingeckoSymbols, index: number): Promise<CryptoInfoResponse> {
        try {
            const { data } = await axios.get<CoinGeckoCryptoInfo>(`${this.coingeckoBaseURL}/${crypto.id}`);
            const { market_data: { current_price } } = data;


            if (isNaN(current_price["usd"])) {
                return {
                    ok: false
                }
            }

            return {
                ok: true,
                data: {
                    ...crypto,
                    alert: false,
                    index,
                    checkTime: Date.now(),
                    lastPrice: Number(current_price["usd"])
                }
            }
        } catch (error) {
            this.stop();
            console.log("Process has ended with error", error);

            return {
                ok: false
            }
        }
    }

    private stop() {
        this.isProcessRunning = false;

        for (const key in this.telegramUsers) {
            const { telegramChatId }: TelegramManagmentUsers = this.telegramUsers[key];

            this.bot.sendMessage(telegramChatId, "I'm going to sleep. I'll send a message when I'm back. 💤💤💤");
        }
    }

    private async start() {
        this.isProcessRunning = true;

        await this.coingeckoCryptos.mergeAvailableCryptos();
        this.availableCryptos = this.coingeckoCryptos.getSymbols();

        for (let index = 0; this.isProcessRunning;) {
            if (this.cryptosInformation.length < this.availableCryptos.length) {
                const cryptoData = await this.getCryptoData(this.availableCryptos[index], index);

                if (cryptoData.ok) {
                    this.cryptosInformation.push(cryptoData.data);
                }
            }
            else {
                this.checkCryptoChanges(this.cryptosInformation[index]);
            }

            index++;

            index %= this.availableCryptos.length;

            await this.sleep(1000);

        }

        console.log("PROCESS HAS STOPPED");
        console.log(this.telegramUsers);
        
        

    }
}