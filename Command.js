class Command{

    constructor(){
        if (this.onMessage === undefined) {
            throw new TypeError("Must override method");
        }
        if (this.help === undefined) {
            throw new TypeError("Must override method");
        }
    }

    onMessage(message, args){
    }

    help(){    
    }

}
module.exports = Command;