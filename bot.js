require('dotenv').config();
const { Telegraf } = require('telegraf')
const api = require('covid19-api');
const { caseStatusUndeEvalutationInPR } = require('covid19-api/src/api/api');
const COUNTRIES_LIST = require('./constatns');

const bot = new Telegraf('1934910040:AAFkEAf8N096Bg05GB5PrHKekXtsYbc8PV8')
bot.start((ctx) => ctx.reply(`
Привет ${ctx.message.from.first_name}
Узнай статистику по Короновирусу.
Введи на английском название страны и получи статистику.
Посмотреть весь список стран можно командой /help.
`));

bot.help((ctx) => ctx.reply(COUNTRIES_LIST));

bot.on('text', async(ctx) => {
    let data = {};

    try {
        data = await api.getReportsByCountries(ctx.message.text);
        const formatData = `
Страна: ${data[0][0].country}
Случаи: ${data[0][0].cases}
Смертей: ${data[0][0].deaths}
Вылечились: ${data[0][0].recovered}
                `;
        ctx.reply(formatData);
    } catch {
        console.log('Ошибка');
        ctx.reply('Ошибка, такой страны не существует');
    }
});
bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));