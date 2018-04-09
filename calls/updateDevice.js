const util = require('util');
const { execFile } = require('child_process');

//Scan BT Devices calling external method and waiting execution
function update(mac, image) {
    return new Promise(function(resolve, reject) {
    	//Dummy-Printing node version
        execFile('ping', ['8.8.8.8'], (error, stdout, stderr) => {
		  if (error) {
		  	reject(error);
		  }
		  	resolve(stdout);
		});
    })
};


module.exports = update;