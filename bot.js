const Discord = require('discord.io');

const logger = require('winston');
const auth = require('./auth.json');

/**
 * Configure logger settings
 */
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
  colorize: true,
});
logger.level = 'debug';

/**
 * Initialize Discord Bot
 */
const bot = new Discord.Client({
  autorun: true,
  token: auth.token,
});

bot.on('ready', (evt) => {
  logger.info('Connected');
  logger.info('Logged in as: ');
  logger.info(bot.username + ' - (' + bot.id + ')');
});

bot.on('message', (user, userID, channelID, message, evt) => {
  /**
   * Our bot needs to know if it needs to execute a command.
   * For this script it will listen for messages that will start with `!`
   */
  if (message.substring(0, 1) == '!') {
    const args = message.substring(1).split(' ');
    const cmd = args[0];

    args = args.splice(1);

    switch (cmd) {
      // !ping
      case 'ping':
        bot.sendMessage({ to: channelID, message: 'Pong!' });
        break;
      default:
        bot.sendMessage({ to: channelID, message: 'Unknown command.' });
    }
  }
});
