_bot = bot; //imports the bot instance since its a global
const Discord = require("discord.js")
const Database = require("./Database")
const ytdl = require('ytdl-core');
const db = new Database();

class Media{

    constructor(){
        //we manage this ourselve instead of the collection they provide us
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
        promise.then( data => this.assignConnection(data, channel_id));
    }

    _exists(channel_id){
        if(this.instances.get(channel_id) !== undefined){
            return true;
        }
        return false;
    }

    playYoutube(channel_id, url){
        if(this._exists(channel_id)){
            this.dispatcher = this.instances.get(channel_id).play(ytdl(url, { filter: 'audioonly' , volume: 0.5 }));
        }
        
    }

    pause(channel_id){
        if(this._exists(channel_id)){
            this.instances.get(channel_id).pause();
        }
    }

    resume(channel_id){
        if(this._exists(channel_id)){
            this.instances.get(channel_id).pause();
        }
    }

    leave(channel_id){
        if(this._exists(channel_id)){
            this.instances.get(channel_id).end();
        }
        
    }

    setVolume(channel_id,volume){
        if(this._exists(channel_id)){
            this.instances.get(channel_id).setVolume(volume/100) ;
        }
    }

    info(channel_id){
        if(this._exists(channel_id)){
            return this.instances.get(channel_id);
        }
    }

    isPaused(channel_id){
        if(this._exists(channel_id)){
            return this.instances.get(channel_id).player.pausedSince ;
        }
    }

    assignConnection(connection, channel_id){
        if(!this._exists(channel_id)){
            this.instances.set(channel_id,connection);
        }     
    }

    checkConnection(){
    }


}


module.exports = Media;
