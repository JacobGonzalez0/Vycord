const Command = require("../Command");
const Media = require("../Media");
// message object in onMessage() can be found at
// https://discord.js.org/#/docs/main/stable/class/Message
class Play extends Command{

    constructor(){
        super();
    }

    //Override
    onMessage(message, args){
        //it just heps for some reason
        bot.media.playYoutube(message.member.voice.channel.id, 
            args[0])  
    }

    //Override
    help(){
        let helpText = `Play a youtube link <url>`
        return helpText
    }

}

module.exports = Play;