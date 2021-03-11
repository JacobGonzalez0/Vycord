const Command = require("../Command");

// message object in onMessage() can be found at
// https://discord.js.org/#/docs/main/stable/class/Message
class Hep extends Command{

    //Override
    onMessage(message, args){
        //it just heps for some reason

        message.channel.send("*heps*");
    }

    //Override
    help(){
        let helpText = `It just heps`
        return helpText
    }

}

module.exports = Hep;