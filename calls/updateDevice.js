const util = require('util');
const { execFile } = require('child_process');
//Config file
var config = require('../config.js').get(process.env.NODE_ENV);

//Update specific BT Device calling external method and waiting execution
function update(mac, image) {
    return new Promise(function(resolve, reject) {
    	//Dummy-Printing node version
        execFile(config.updatepath, [mac], (error, stdout, stderr) => {
			if (error) reject(error);
		 	resolve(stdout);
		});
    })
};

module.exports = update;