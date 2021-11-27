const { fetch } = require('cross-fetch');
require('dotenv').config();

const bot_token_cmd = process.env.DFA_CMD;
const bot_token_apt = process.env.DFA_APT;
const chat_id = process.env.CHAT_ID;

function send_log(msg){
    const TELEGRAM_API = `https://api.telegram.org/bot${bot_token_cmd}/sendMessage?chat_id=${chat_id}&text=${msg}`;
    let response = fetch(TELEGRAM_API)
        //console.log(response);
}

function send_notif(msg){
  const TELEGRAM_API = `https://api.telegram.org/bot${bot_token_apt}/sendMessage?chat_id=${chat_id}&text=${msg}`;
  let response = fetch(TELEGRAM_API);
      //console.log(response);
}

module.exports = { send_log, send_notif }