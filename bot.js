//============================ Logging set up ==================================
// require winston.js logging package
var winston = require('winston');
//Get the current dateTime do write in the logging file name
var dtNow = GetFormatedDateTime(true);

const { combine, printf } = winston.format;

const myFormat = printf(({ level, message }) => {
	return `[${GetFormatedDateTime(false)}] [${level}] ${message}`;
});

//Initialise the logger
const logger = winston.createLogger({
	level: 'debug',
	format: winston.format.combine(	
		winston.format.colorize(),	
		myFormat
	),
	transports: [
		new winston.transports.Console(),
		// - Write to all logs with level `info` and below to `combined.log` 
		// - Write all logs error (and below) to `error.log`.		
		new winston.transports.File({ filename: './Logs/' + dtNow + 'error.log', level: 'error' }),
		new winston.transports.File({ filename: './Logs/' + dtNow + 'combined.log' })
	]
});

//============================ Discord bot set up ==================================
const Discord = require('discord.js');
var location = 'D:\\GitHub\\ForebotToken';
const auth = require(location + '/auth.json');


//Initialise the bot
const bot = new Discord.Client()

//event when the bot has logged in
bot.on('ready', () => {
	logger.info('Connected');
	logger.info('Logged in as: ' + bot.user.tag);

	var serverList = "";
	bot.guilds.forEach((guild) => {
		serverList = serverList + "\n - " + guild.name;
	})
	logger.info('Servers:' + serverList);
	
});

bot.login(auth.token);




// ============================ Helper functions ==================================

//Summary: 
//	Function gets a formatted TimeDate string, formatted with either
//		file name characters, or user readable characters
//params:
//	forFileNames: Boolean, true for file name formatting, false for user reading characters.
//Returns:
//	Formatted TimeDate string
function GetFormatedDateTime(forFileNames) {
	var today = new Date();
	var dateSep = '/';
	var timeSep = ':';
	var tdSep = ' ';

	if (forFileNames == true) {
		dateSep = '-';
		timeSep = '-';
		tdSep = '_';
	}

	var year = today.getFullYear();
	var month = (today.getMonth() + 1);	
	var day = today.getDate();	

	var hour = today.getHours();
	var min = today.getMinutes();
	var sec = today.getSeconds();

	if (month < 10) {
		month = "0" + month;
	}
	if (day < 10) {
		day = "0" + day;
	}
	
	if (hour < 10) {
		hour = "0" + hour;
	}
	if (min < 10) {
		min = "0" + min;
	}
	if (sec < 10) {
		sec = "0" + sec;
	}

	var date = year + dateSep + month + dateSep + day;
	var time = hour + timeSep + min + timeSep + sec;
	return date + tdSep + time;

}