const settings = require("./settings.json")
const bcrypt = require('bcrypt');
const saltRounds = 10;

class Database{

    constructor(){
        this._mysql = require('mysql');
        this._connection = this._mysql.createConnection(settings.mysql);

        this._connection.connect(function(err) {
           
        });
    }

    close(){
        this._connection.destroy();
    }

    clearCommands(callback){
        this._connection.query("DELETE FROM commands;", function (error, results, fields){
            this._connection.query("DBCC CHECKIDENT ('commands', RESEED, 0);", function (error, results, fields){
                callback();
            })
        })
        
    }

    addCommand(name, help){
        //checks if entry is in the
        this._connection.query('SELECT * FROM commands WHERE name = ?', name, (error, results, fields)=>{
            if(results.length < 1){
                this._connection.query('INSERT INTO commands (`name`, `help`) VALUES (?,?);', [name,help], function () {
                    if (error) throw error;
                    console.log(results);
                });
            }else{
                if(results[0].help != help){ //checks if help text changed
                    this._connection.query('UPDATE commands SET help = ? WHERE name = ?;', [help,name], function () {
                        if (error) throw error;
                        console.log(results);
                    });
                }
            }
        })
        
    }

    //returns array
    getCommands(){
        this._connection.query('SELECT * FROM commands', (error, results, fields)=>{
            return results
        })
    }

    //returns array
    getServers(){
        this._connection.query('SELECT * FROM servers', (error, results, fields)=>{
            return results
        })
    }

    addServer(id, name){
        this._connection.query('SELECT * FROM servers WHERE id = ?', id, (error, results, fields)=>{
            if(results.length < 1){
                this._connection.query('INSERT INTO servers (`id`, `name`) VALUES (?,?);', [id,name], (error, results, fields)=>{
                    if (error) throw error;
                    console.log(results);
                });
            }else{
                if(results[0].name != name){ //checks if server name changed
                    this._connection.query('UPDATE servers SET name = ? WHERE id = ?;', [name,id], function () {
                        if (error) throw error;
                        console.log(results);
                    });
                }
            }
        })
    }

    removeServer(id){
        this._connection.query('DELETE servers WHERE id = ?', id, (error, results, fields)=>{
            if (error) throw error;
            console.log(results);
        })
    }

    addUser(username, email, password, discord_id){
        //sanatize
        if(typeof username == "string"){
            if(username.length > 50) {
                throw "Username too long!";
            }
            if(username.length <= 0) {
                throw "Username is required";
            }
        }else{
            throw "Invalid username";
        }

        if(typeof email == "string"){
            if(email.indexOf("@") == -1) {
                throw "Invalid email/domain";
            }
            //TODO: loop though all possible TLD's to see if valid domain, and blacklist spam sites
        }else{
            throw "Invalid email";
        }

        if(typeof password == "string"){
            if(password.length <= 7) {
                throw "Password too short";
            }
            if(password.length >= 50) {
                throw "Password too long";
            }
        }else{
            throw "Invalid Password";
        }

        //TODO: check discord_id valid
        let _connect = this._connection
        bcrypt.hash(password, saltRounds, function(err, hash) {
            _connect.query("SELECT username, email FROM users WHERE username = ? OR email = ?",
            [username,email],
            (error, results, fields)=>{
                if (error) throw error;
                console.log(results)
                if(results.length < 1){
                    _connect.query('INSERT INTO users (`username`, `email`, `password`, `discord_id`, `admin`) VALUES (?,?,?,?,?);',
                    [username, email, hash, discord_id, 0], (error, results, fields)=>{
                        if (error) throw error;
                        console.log(results);
                    });
                }else{
                    throw "Username already exists"
                }
            })
        });

        
        
    }






}

module.exports = Database;