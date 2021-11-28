const TelegramBot = require("node-telegram-bot-api");
//const checker = require('./index.js');
const { checker } = require('./index')

require('dotenv').config();

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(process.env.DFA_CMD, {polling: true});


bot.onText(/\/start/, (msg) => {
bot.sendMessage(msg.chat.id, "Welcome");

});

bot.onText(/\/help/, (msg) => {
    bot.sendMessage(msg.chat.id, "No help at the moment.");
    
    });

bot.onText(/\/status/, (msg) => {
    bot.sendMessage(msg.chat.id, "I'm alive ^^");
    
    });

bot.onText(/\/sudostart/, (msg) => {
    bot.sendMessage(msg.chat.id, "Ok.");
    console.log('Ok')
    checker.run()
    });

bot.onText(/\/sudostop/, (msg) => {
    bot.sendMessage(msg.chat.id, "Ending task..");
    checker.stop(false)
    console.log('Task ended.')
    });
