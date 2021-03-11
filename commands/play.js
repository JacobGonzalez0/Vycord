const Command = require("../Command");
const Media = require("../Media");
// message object in onMessage() can be found at
// https://discord.js.org/#/docs/main/stable/class/Message
class Play extends Command{

    constructor(){
        super();
        this.test = 0;
        this.media = null;
    }

    //Override
    onMessage(message, args){
        //it just heps for some reason
        
        
        if(this.test == 0){
            this.media = new Media("752731337055535116")
            this.test ++;
        }else{
            this.media.join()
            this.media.checkConnection();
        }
        

        
        
    }

    //Override
    help(){
        let helpText = `It just heps`
        return helpText
    }

}

module.exports = Play;