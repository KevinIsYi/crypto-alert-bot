process.env.NTBA_FIX_319 = "1";

import { CryptoPumpBot } from "./models/CryptoPumpBot";
// import { CryptoSymbols } from "./models/CryptoSymbols";
import dotenv from 'dotenv';

dotenv.config();

// const token = process.env.TELEGRAM_TOKEN;
// const bot = new TelegramBot(token!, { polling: true });

// const main = async(bot: TelegramBot, id: number) => {
//     const coingeckoCryptos = new CryptoSymbols();
//     bot.sendMessage(id, "Ok... I'm going to start fetching data, this will take a couple of seconds. Call the cops if you don't hear about me in more than a minute. 😨");
//     await coingeckoCryptos.mergeAvailableCryptos();
//     const availableCryptos = coingeckoCryptos.getSymbols();
    
//     bot.sendMessage(id, "I told you I would be ok. Now I'm starting to get the initial data... Next time I'll bring a signal with me. 😍");
//     bot.sendMessage(id, "Quick heads up, I am pretty basic right now, but I'll get smarter as time goes... 😏");
//     const cryptoBot = new CryptoPumpBot(availableCryptos, bot);
//     cryptoBot.start();
// }

// bot.on("message", (msg) => {
//     const chatId = msg.chat.id;

//     bot.sendMessage(chatId, `Hey! I don't know how you are or what you want. But I like you, just for being here with me. Starting... 😉`);
//     main(bot, chatId);
// });

new CryptoPumpBot();