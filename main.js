const Discord = require('discord.js');
const FileLoader = require('./FileLoader')
bot = new Discord.Client();
const settings = require('./settings.json')
const Database = require('./Database')
const db = new Database();
const Media = require('./Media')


bot.updateServers = ()=>{
    //const Guilds = new Discord.Collection();
    Array.from(bot.guilds.cache).forEach( guild =>{
        //gets the id and name from the guilds cache
        //Guilds.set(guild[1].id, guild[1].name)
        db.addServer(guild[1].id, guild[1].name)
        let roles = Array.from(guild[1].roles.cache)
        roles.forEach( group =>{
            db.addGroup(guild[1].id, group[1].id, group[1].name )
        })
    })
}

bot.on('ready', () => {
    // db.changePermission("groupid","hep",1)
    // db.changePermission("groupid","join",1)
    // db.changePermission("groupid","play",1)
    // db.changePermission("groupid","pause",1)
    // db.changePermission("groupid","leave",1)
    // db.changePermission("groupid","pixibay",1);
    bot.updateServers();
    bot.media = new Media();
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
        if(bot.commands.get(command.slice(settings.prefix.length))){ //checks if its a legal command
            let run = true;
            for(let i = 0; i < message.member._roles.length; i++){
                db.checkPermission(message.member._roles[i], command.slice(settings.prefix.length), ()=>{
                    if(run){
                        bot.commands.get(command.slice(settings.prefix.length))
                        .onMessage(message, args);
                        run = false; // flag to keep it from running more than once
                    }else{
                        return;
                    }
                })
            }     
        }else{
            return
        }
    }catch(e){
        console.error(e);
        return;
    }
    


})

bot.login(settings.token);