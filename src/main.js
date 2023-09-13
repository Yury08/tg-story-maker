import { Telegraf } from 'telegraf';
import config from 'config';
import { message } from 'telegraf/filters';
import { chatGpt } from "./chatgpt.js";
import { create } from "./notion.js";
import { Loader } from './loader.js'


const bot = new Telegraf(config.get("TG_TOKEN"), {
    handlerTimeout: Infinity
})


bot.command('start', (ctx) => {
    ctx.reply("Добро пожаловать в бота. Отправте текстовое сообщение с тезасами про историю.")
})
bot.on(message('text'), async (ctx) => {
    try {
        const text = ctx.message.text
        // trim уберает пробелы слева и справа
        if (!text.trim()) {
            return ctx.reply('Текст не может быть пустым');
        };

        const loader = new Loader(ctx);
        loader.show();

        const res = await chatGpt(text);

        if (!res) {
            return ctx.reply('Ошибка с API', res);
        }

        const notionRes = await create(text, res.content);
        loader.hide();
        ctx.reply(`Ваше история: ${notionRes.url}`)

    } catch (e) {
        console.log('Error while proccessing text: ', e.message)
    }
});

// запускаем бота
bot.launch();