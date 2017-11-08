var Discord = require('discord.io');

var bot = new Discord.Client({
    token: "Mzc3NjQyNTE4ODQ3Njg0NjA5.DOP9xg.pQ_pb3IQb9fXWrgKkYMjUyaWnNA",
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
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];

        args = args.splice(1);

        switch(cmd) {
            // !ping
            case 'Bibot':
                bot.sendMessage({ to: channelID, message: 'Morbleu!' });
            break;
            default:
                bot.sendMessage({ to: channelID, message: 'Unknown command.' });
        }
    }
})
