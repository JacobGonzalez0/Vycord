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
            if (error) throw error;
            if(results.length == 0){
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
    getServers(callback, promise){
        this._connection.query('SELECT * FROM servers;', (error, results, fields)=>{
            if (error) throw error;
            callback(results, promise)
        })
    }

    addServer(id, name){
        this._connection.query('SELECT * FROM servers WHERE id = ?;', id, (error, results, fields)=>{
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

        //inside this callback we lose track of this keyword
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

    checkPassword(username, password){
        this._connection.query('SELECT username, password FROM users WHERE username = ?', username, (error, results, fields)=>{
            if(results.length == 1){
                bcrypt.compare(password, results[0].password, function(err, result) {
                    console.log(result)
                });
            }else if(results.length >= 2){
                throw "too many users found, database error"
            }else{
                throw "no user found"
            }
        })
    }

    changePassword(username, oldPassword, newPassword){
        let _connect = this._connection;
        _connect.query('SELECT username, password FROM users WHERE username = ?', username, (error, results, fields)=>{
            if(results.length == 1){
                bcrypt.compare(oldPassword, results[0].password, function(err, result) {
                    if(result){
                        bcrypt.hash(newPassword, saltRounds, function(err, hash) {
                            _connect.query('UPDATE users SET password = ? WHERE username = ?;', [hash,username], function () {
                                if (error) throw error;
                                console.log(results);
                            });
                        });
                        
                    }else{
                        throw "incorrect password"
                    }
                });
            }else if(results.length >= 2){
                throw "too many users found, database error"
            }else{
                throw "no user found"
            }
        })
    }

    addGroup(server_id, group_id, name){
        this._connection.query('SELECT id FROM groups WHERE id = ?', [group_id] , (error, results, fields)=>{
            if (error) throw error;
            if(results.length < 1){
                this._connection.query('INSERT INTO groups (`id`, `server_id` , `name`) VALUES (?,?,?);', 
                [ group_id, server_id, name], 
                (error, results, fields)=>{
                    if (error) throw error;
                    //console.log(results);
                });
            }else{
                if(results[0].name != name){ //checks if group name changed
                    this._connection.query('UPDATE groups SET name = ? WHERE id = ?;', [name,group_id], function () {
                        if (error) throw error;
                        //console.log(results);
                    });
                }
            }
        })
    }

    changePermission(group_id, command, enable){
        this._connection.query('SELECT id FROM commands WHERE name = ?', [command] , (error, results, fields)=>{
            if (error) throw error;
            if(results.length > 0){ // checks if the command is even found
                if(enable > 1) enable = 1;
                let command_id = results[0].id;
                this._connection.query('SELECT * FROM permissions WHERE command_id = ? AND group_id = ?', 
                [command_id,group_id] , (error, results, fields)=>{

                    if(results.length > 0){ // if the permission exists already
                        this._connection.query('UPDATE permissions SET enable = ? WHERE command_id = ? AND group_id = ?', 
                        [enable, command_id, group_id], 
                        (error, results, fields)=>{
                            if (error) throw error;
                            console.log(results);
                        });
                    }else{ // create the new permission entry because it doesn not exist
                        this._connection.query('INSERT INTO permissions (`command_id`, `group_id`, `enable`) VALUES (?,?,?);', 
                        [command_id, group_id, enable], 
                        (error, results, fields)=>{
                            if (error) throw error;
                            console.log(results);
                        });
                    }


                })

            }else{
                throw "no command found"
            }
            
        })

    }

    checkPermission(group_id, name, callback){
        this._connection.query(`
            SELECT permissions.command_id AS command_id, permissions.group_id AS group_id, commands.name AS name, permissions.enable AS enable
            FROM permissions
            JOIN commands ON permissions.command_id = commands.id
            WHERE name = ? AND group_id = ?;
        `,[name, group_id], 
        (error, results, fields)=>{
            if (error) throw error;
            if(results.length > 0){
                if(results[0].enable >= 1){
                    callback();
                }  
            }    
        });

    }

}

module.exports = Database;