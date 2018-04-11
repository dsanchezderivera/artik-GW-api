const util = require('util');
const { execFile } = require('child_process');

//Scan BT Devices calling external method and waiting execution
function scanBT() {
    return new Promise(function(resolve, reject) {
    	//Execution of external call
         execFile('node', ['--version'], (error, stdout, stderr) => {
		  if (error) {
		  	reject(error);
		  }
		  //Some dummy data
		  let dummy= {
			  "result": true,
			  "gateway_ip": "192.168.1.200",
			  "gateway_port": "5000",
			  "devices": [
			    {
			      "id": "0",
			      "mac": "3DF2C9A6B34F",
			      "screen": "27bw",
			      "rssi": "-68",
			      "batt": "90",
			      "initcode": "000369"
			    },
			    {
			      "id": "1",
			      "mac": "3DF2C9A6B36D",
			      "screen": "27bw",
			      "rssi": "-46",
			      "batt": "56",
			      "initcode": "000325"
			    },
			    {
			      "id": "2",
			      "mac": "3DF2C9A6B33B",
			      "screen": "27bw",
			      "rssi": "-87",
			      "batt": "78",
			      "initcode": "000326"
			    }
			  ]
			}
		  	//resolve(stdout);
		  	resolve(dummy);
		});
    })
};


module.exports = scanBT;