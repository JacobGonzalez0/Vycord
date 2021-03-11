const Discord = require('discord.js');
const FileLoader = require('./FileLoader')
bot = new Discord.Client();
const settings = require('./settings.json')
const Database = require('./Database')

bot.updateServers = ()=>{
    let db = new Database();
    //const Guilds = new Discord.Collection();
    Array.from(bot.guilds.cache).forEach( guild =>{
        //gets the id and name from the guilds cache
        //Guilds.set(guild[1].id, guild[1].name)
        db.addServer(guild[1].id, guild[1].name)
    })
    db.addUser("pon","user@email.com","password123","910231231231");
}



bot.on('ready', () => {
    bot.updateServers();
    console.log(`Logged in as ${bot.user.tag}!`);
});

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