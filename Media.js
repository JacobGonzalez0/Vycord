_bot = bot; //imports the bot instance since its a global
const Discord = require("discord.js")
const Database = require("./Database")
const ytdl = require('ytdl-core');
const db = new Database();

class Media{

    constructor(){
        
        this.instances = new Discord.Collection();
        
    }

    addInstance(channel_id){
        //this is all so the connection object can be stored in our class.
        
        let promise = new Promise(resolve => {
            db.getServers( (data, promise)=>{
                for(let i = 0; i < data.length;i++){
                    try{
                        resolve(bot.guilds.cache.get( String(data[i].id) ).channels.cache.get(channel_id).join());
                    }catch(e){
                        return;
                    }
                }
            })
        });
        //this.assignConnection(data)
        promise.then( data => this.assignConnection(data, channel_id));
        
    }


    playYoutube(channel_id, url){
        this.dispatcher = this.instances.get(channel_id).play(ytdl(url, { filter: 'audioonly' }))
    }

    assignConnection(connection, channel_id){        
        this.instances.set(channel_id,connection)
    }

    checkConnection(){
        console.log(this);
    }


}


module.exports = Media;
