const TelegramBot = require("node-telegram-bot-api");
const { checker } = require('./index')
require('dotenv').config();

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(process.env.DFA_CMD, {polling: true});



bot.onText(/\/help/, (msg) => {
    bot.sendMessage(msg.chat.id, "No help at the moment.");
    });

bot.onText(/\/status/, (msg) => {
    bot.sendMessage(msg.chat.id, "I'm alive ^^");
    });

bot.onText(/\/stop/, (msg) => {
    bot.sendMessage(msg.chat.id, "Ending task..");
    checker.stop()
    console.log('Ok')
    });



bot.onText(/\/start/, (msg) => {

    bot.sendMessage(msg.chat.id, "Type of appointment", {
    "reply_markup": {
            "keyboard": [["Individual", "Group"]],
            "resize_keyboard": true,
            "one_time_keyboard": true
        }
    });
});

bot.on('message', (msg) => {
    var indv = "individual";
    if (msg.text.toString().toLowerCase().includes(indv)) {
        bot.sendMessage(msg.chat.id, "Appointment Type: Individual");
        bot.sendMessage(msg.chat.id, "Task running..");
        checker.individual()
        checker.run()
    }
    var grp = "group";
    if (msg.text.toString().toLowerCase().includes(grp)) {
        bot.sendMessage(msg.chat.id, "How many client?", {
            "reply_markup": {
                    "keyboard": [["2", "3"], ["4", "5"]],
                    "resize_keyboard": true,
                    "one_time_keyboard": true
                }
        });
    }
    var count = ['2', '3', '4', '5']
    if (count.includes(msg.text.toString())) {
        bot.sendMessage(msg.chat.id, "Appointment Type: Group");
        bot.sendMessage(msg.chat.id, "Number of client: " + msg.text);
        bot.sendMessage(msg.chat.id, "Task running..");
        checker.group(msg.text)
        checker.run()
    }
});
