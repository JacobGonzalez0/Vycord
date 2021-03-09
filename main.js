const Discord = require('discord.js');
const FileLoader = require('./FileLoader')
bot = new Discord.Client();
const settings = require('./settings.json')

bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.tag}!`);
});

// client.on('message', msg => {
//   if (msg.content === 'ping') {
//     msg.reply('pong');
//   }
// });
let fs = new FileLoader();

bot.commands = fs.parseCommands( 
    fs.checkDir("commands")
)

bot.on('message', (message)=>{

    //doesnt listen to other bots
    if(message.author.bot) return;

    //Wont respond to direct messages
    if(message.channel.type === "dm"){
        return
    }

    //splits the entire string into an array
    let msgArray = message.content.split(" ");
    //make each argment lowercase to avoid case sensitive commands
    msgArray.forEach( (element) => {
        element.toLowerCase()
    })
    //seperates command and arguments
    let command = msgArray[0].toLowerCase();
    let args = msgArray.slice(1);
    
    //exec command
    try{
        bot.commands.get(command.slice(settings.prefix.length))
        .onMessage(message, args)
    }catch(e){
        return;
    }
    


})


bot.login(settings.token);