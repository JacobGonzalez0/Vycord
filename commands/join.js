const Command = require("../Command");
// message object in onMessage() can be found at
// https://discord.js.org/#/docs/main/stable/class/Message
class Join extends Command{

    constructor(){
        super();
        this.test = 0;
    }

    //Override
    onMessage(message, args){
        //it just heps for some reason
        
        console.log(message.channel.id)
        bot.media.addInstanceAndJoin(message.channel.id);
    
    }

    //Override
    help(){
        let helpText = `It just heps`
        return helpText
    }

}

module.exports = Join;