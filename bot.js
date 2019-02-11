var Discord = require('discord.io');

var logger = require('winston');
var auth = require('./auth.json');


// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';


// Initialize Discord Bot
var bot = new Discord.Client({
    token: auth.token,
    autorun: true
});


bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

let title = ''
let entries = []

bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it needs to execute a command
    // for this script it will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
	//take the message, chop the ! and split by spaces
        var args = message.substring(1).split(' ');
	//the command is the first part
        var cmd = args[0];

        args = args.splice(1);

        switch(cmd) {
            // !ping
            case 'ping':
                bot.sendMessage({ to: channelID, message: 'Pong!' });
		break;
	    // !new Title of List
	    case 'new':
		title = message.substring(5);
	        bot.sendMessage({ to: channelID, message: 'Starting new list: '+title });
		break;
	    // !title
	    // Repeat the current title
	    case 'title':
	        bot.sendMessage({ to: channelID, message: 'Current title is: '+title });
		break;
	    case 'add':
		entry = message.substring(5);
		entries.push(entry);
	        bot.sendMessage({ to: channelID, message: 'Adding entry'+entries.length+'to '+title });
		break;
	    case 'end':
		let listmessage = '';
		listmessage = listmessage + title + "\n"
		for (var entrynum = 0; entrynum < entries.length; entrynum++) {
		    let humnum = entrynum + 1;
	            listmessage = listmessage + humnum+". "+entries[entrynum]+"\n";
		}
		listmessage = listmessage + "-----END-----"
	        bot.sendMessage({ to: channelID, message: listmessage });
		break;
            default:
                bot.sendMessage({ to: channelID, message: 'Unknown command.' });
        }
    }
})
