var Discord = require('discord.io');
var fs = require('fs');

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

class Zadelrazz {
    constructor(discordClient) {
        this.bot = discordClient;
        this.helpText = "Commands:"
        + "\n!new [NAME] : Start listening for entries to table NAME."
        + "\n    -> Each following message that begins with i., where i is an integer, will be added to the table."
        + "\n!title : Print the active table's name."
        + "\n!end : Close the active table, list its contents, and save them to the server."
        + "\n!help : Display this help message.";
    }
    newList(title, channelID) {
        titles[channelID] = title;
        activeLists[channelID] = new RPGList(title, channelID);
        fs.writeFile('titles.json',
            JSON.stringify(titles),
            (err) => { if (err) throw err; }
        );
        this.bot.sendMessage({
            to: channelID,
            message: 'Starting: '+titles[channelID]
        });
    }
    sendActiveTitle(channelID) {
        if (channelID in activeLists) {
            this.bot.sendMessage({
                to: channelID,
                message: 'Current: '+titles[channelID]
            });
        } else {
            this.bot.sendMessage({
                to: channelID,
                message: 'No known list for this channel'
            });
        }
    }
    endActiveList(channelID) {
        this.bot.sendMessage({
            to: channelID,
            message: activeLists[channelID].printable
        });
        activeLists[channelID].save();
    }
    sendHelpText(channelID) {
        bot.sendMessage({
            to: channelID,
            message: this.helpText
        });
    }
}

class RPGList {
    constructor(title, channelID) {
	    this.channelID = channelID
	    this.title = title;
	    this.path = __dirname+"/lists/"+channelID+"/"+title+".json"
	    this.entries = [];
	    fs.mkdir(__dirname+"/lists/"+channelID,
	              { recursive: true }, (err) => {
		      if (err) throw err;
	    });
	    logger.info("initialized "+this.path);
    }

    //add an entry to a list
    addEntry(message) {
	    this.entries.push(message);
	    this.save();
    }

    //get a printable version with title and numbered entries
    get printable(){
	    let printable = this.title+"\n";
            for (var entrynum = 0; entrynum < this.entries.length; entrynum++) {
                let humnum = entrynum + 1;
                printable = printable + humnum+". "+this.entries[entrynum]+"\n";
            };
	    return printable;
    }

    get json(){
	    return JSON.stringify(this);
    }

    load(path) {
	    this.entries = require(this.path);
    }

    save() {
    	fs.writeFile(
                this.path,
    			JSON.stringify(this.entries),
    			(err) => { if (err) throw err;
    	                   logger.info('saved '+this.path); }
            )
    }
}

//start activelists as blank, to contain list objects
let activeLists = {};

//initialize titles from the last known list of active tables
//this will fail bad if titles.json hasn't yet been created
//let titles = {};
if (fs.existsSync("./titles.json")) {
    var titles = require("./titles.json")
} else {
    var titles = {};
}

logger.info("Loading lists according to titles.json:");
logger.info(titles);

//for each active title, load that list from file
//key = channelID, titles[key] = title
for (var key in titles) {
	logger.info("loading "+titles[key]+" for channelID "+key);
	let newlist = new RPGList(titles[key], key);
	newlist.load("./lists/"+key+"/"+titles[key]);
	activeLists[key] = newlist;
	logger.info("success");
}



let title = '';
let entries = [];
var zd = new Zadelrazz(bot);

bot.on('message', function (user, userID, channelID, message, evt) {
    // Listen for messages that start with `!` and process the first word
    // as a command
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
        args = args.splice(1);

        switch(cmd) {
	    // !new [title]
	    case 'new':
    		title = message.substring(5);
    		zd.newList(title, channelID);
    		break;
	    case 'title':
    		zd.sendActiveTitle(channelID);
    		break;
	    ///save the list and reprint it collated
	    case 'end':
            zd.endActiveList(channelID);
    		break;
        case 'help':
            zd.sendHelpText(channelID);
            break;
        default:
            bot.sendMessage({ to: channelID, message: 'Unknown command.' });
            zd.sendHelpText();
        }
    }

    //catch list entries that are just a number and a dot
    let dotsplits = message.split('.');
    if (dotsplits[0].length > 0 && !isNaN(dotsplits[0])) {
    	if (channelID in activeLists) {
    	    let entrytext = message.substring(message.indexOf(".")+1);
    	    entrytext = entrytext.trim();
    	    bot.addReaction({
    	        channelID: channelID,
    	        messageID: evt.d.id,
    	        reaction: "🤖"
    	    }, (err,res) => {
    	        if (err) logger.info(err)
    	    });
    	    logger.info('The entry is: '+entrytext);
    	    logger.info(activeLists[channelID].json);
    	    activeLists[channelID].addEntry(entrytext);
    	} else {
    		logger.info('ignoring message until list declaration');
    	}
    	// bot.sendMessage({ to: channelID, message: 'Adding #'+lists[channelID].entries.length+' to '+lists[channelID].title });

    }

})
