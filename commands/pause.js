const Command = require("../Command");
const Media = require("../Media");
// message object in onMessage() can be found at
// https://discord.js.org/#/docs/main/stable/class/Message
class Pause extends Command{

    constructor(){
        super();
    }

    //Override
    onMessage(message, args){
        //it just heps for some reason
        bot.media.pause(message.member.voice.channel.id)  
    }

    //Override
    help(){
        let helpText = `Pauses bot in current channel`
        return helpText
    }

}

module.exports = Pause;