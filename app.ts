// process.env.NTBA_FIX_319 = "1";

import { CryptoPrices } from "./models/CryptoPrices";
import { CryptoSymbols } from "./models/CryptoSymbols";

// import TelegramBot from 'node-telegram-bot-api';
// import dotenv from 'dotenv';
// import { CryptoSymbols } from './models/CryptoSymbols';

// dotenv.config();

// const token = process.env.TELEGRAM_TOKEN;

// const bot = new TelegramBot(token!, { polling: true });

// bot.on("message", (msg) => {
//     const chatId = msg.chat.id;

//     bot.sendMessage(chatId, "Hey! I don't know how you are or what you want. But I like you, just for being here with me.")
// });


const main = async() => {
    const coingeckoCryptos = new CryptoSymbols();
    await coingeckoCryptos.mergeAvailableCryptos();
    const availableCryptos = coingeckoCryptos.getSymbols();
    
    const cryptoBot = new CryptoPrices(availableCryptos);
    cryptoBot.start();
}

main();