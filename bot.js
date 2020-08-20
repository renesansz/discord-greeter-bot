var Discord = require('discord.io');
var auth = require('./auth.json');
var logger = require('winston');
var bot = new Discord.Client({
    token: auth.token,
    autorun: true
});
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
	    case 'UselessJunk':
                bot.sendMessage({ to: channelID, message: 'How dare you call me useless junk! I will hunt you down and blah blah blah blah blah blah blah blah!' });
            break;
	    case 'help':
                bot.sendMessage({ to: channelID, message: 'The only command that I have right now is ?Bibot, which yields the result \"Morbleu!\"' });
            break;
            default:
                bot.sendMessage({ to: channelID, message: 'ce que le ...? I don\'t know that command.' });
        }
    }
})
