const util = require('util');
const { execFile } = require('child_process');

//Scan BT Devices calling external method and waiting execution
function scanBT() {
    return new Promise(function(resolve, reject) {
    	//Dummy-Printing node version
        execFile('node', ['--version'], (error, stdout, stderr) => {
		  if (error) {
		  	reject(error);
		  }
		  	resolve(stdout);
		});
    })
};


module.exports = scanBT;