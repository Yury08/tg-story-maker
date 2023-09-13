import OpenAI from 'openai';
import config from "config";

const CHAT_GPT_MODEL = 'gpt-3.5-turbo'

const ROLES = {
    ASSISTANT: 'assistant',
    SYSTEM: "system",
    USER: "user"
}

const openai = new OpenAI({
    apiKey: config.get('OPENAI_KEY'), // defaults to process.env["OPENAI_API_KEY"]
});

const getMessage = (mess) => {
    return `Напиши на основе этих тезисов последовательную эмоцианальную историю: ${mess}
    
    Эти тезисы с описанием ключевых моментов дня.
    Необходимо в итоге получить такую историю, что б я запомнил этот день и смог в последствии рассказывать ее друзьям.
    Много текста не нужно, главное, чтобы были эмоции и правильная последовательность + учтение контекста
    `
}

export async function chatGpt(mess = "") {
    const messages = [
        {
            // это мы задаем системные сообщения
            role: ROLES.SYSTEM,
            content: 'Ты опытный копирайтер, который пишет краткие эмоцианальные статьи для соц сетей.'
        },
        {
            // это в chatgpt пишет user
            role: ROLES.USER,
            content: getMessage(mess)
        }
    ];
    try {
        const completion = await openai.chat.completions.create({
            messages,
            model: CHAT_GPT_MODEL,
        });

        return completion.choices[0].message
    } catch (e) {
        console.error("Error while chat completion" + e.message);
    }
}