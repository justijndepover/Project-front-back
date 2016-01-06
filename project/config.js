/**
 * Created by Michiel on 6/01/2016.
 */

var config = {
    HOST: 'http://localhost',
    PORT: getEnv('PORT') || 3000,
    MONGODBURL : process.env.MONGO_URI || 'mongodb://localhost/spacewarsDB'
//andere:'mongodb://username:password@localhost/usersDB?options...');
};

function getEnv(variable) {
    if (process.env[variable] === undefined) {
        if (variable == 'PORT') { return 1337 }
        console.log('You must create an environment variable for ' + variable);
    }
    return process.env[variable]; //of bvb. process.env.WEB_PORT
}

module.exports = config;