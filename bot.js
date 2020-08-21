var Discord = require('discord.io');
var auth = require('./auth.json');
var logger = require('winston');
var bot = new Discord.Client({
    token: auth.token,
    autorun: true
});

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it needs to execute a command
    // for this script it will listen for messages that will start with `!`
    if (message.substring(0, 1) == '?') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];

        args = args.splice(1);

        switch(cmd) {
            // When someone says a keyword, the bot is triggerred
            case 'Bibot':
                bot.sendMessage({ to: channelID, message: 'Morbleu!' });
            break;
            case 'IntenseLove':
                bot.sendMessage({ to: channelID, message: 'He seemed so devoted—a very slave—and there was a certain latent intensity in that love which had fascinated her.' });
            break;
            case 'Contempt':
                bot.sendMessage({ to: channelID, message: 'Thus human beings judge of one another, superficially, casually, throwing contempt on one another, with but little reason, and no charity.' });
            break;
            case 'PercySmart':
                bot.sendMessage({ to: channelID, message: 'He was calmly eating his soup, laughing with pleasant good-humour, as if he had come all the way to Calais for the express purpose of enjoying supper at this filthy inn, in the company of his arch-enemy.' });
            break;
            case 'MoneyNoMatter':
                bot.sendMessage({ to: channelID, message: 'Those friends who knew, laughed to scorn the idea that Marguerite St. Just had married a fool for the sake of the worldly advantages with which he might endow her. They knew, as a matter of fact, that Marguerite St. Just cared nothing about money, and still less about a title.' });
            break;
            case 'Brains':
                bot.sendMessage({ to: channelID, message: 'Money and titles may be hereditary,” she would say, “but brains are not.' });
            break;
            case 'SPpoem':
                bot.sendMessage({ to: channelID, message: 'We seek him here, we seek him there, Those Frenchies seek him everywhere. Is he in heaven?—Is he in hell? That demmed, elusive Pimpernel?' });
            break;
            case 'Haters':
                bot.sendMessage({ to: channelID, message: 'How that stupid, dull Englishman ever came to be admitted within the intellectual circle which revolved round “the cleverest woman in Europe,” as her friends unanimously called her, no one ventured to guess—a golden key is said to open every door, asserted the more malignantly inclined.' });
            break;

            default:
                bot.sendMessage({ to: channelID, message: 'ce que le ...? I don\'t know that command.' });
        }
    }
})
