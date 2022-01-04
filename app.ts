process.env.NTBA_FIX_319 = 1;

import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';

dotenv.config();

const token = process.env.TELEGRAM_TOKEN;

const bot = new TelegramBot(token!, { polling: true });

bot.on("message", (msg) => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, "Hey! I don't know how you are or what you want. But I like you, just for being here with me.")

});
