var multer = require('multer'); 
var fs = require('fs');

const btScan = require('../../calls/btScan.js');
const updateDevice = require('../../calls/updateDevice.js');
const imageProc = require('../../helpers/imageProc.js');

//Paths
var folder = './Uploads/';
var fileName = 'image.bmp';

//BLocking
var waiting = false;

//Storage Path and FIlename for images
var Storage = multer.diskStorage({ 
    destination: function (req, file, callback) { 
        callback(null, folder); 
    }, 
    filename: function (req, file, callback) { 
        callback(null, file.originalname); 
    } 
}); 

var upload = multer({ storage: Storage }).single('image'); 

/* GET */
exports.devices_get_all = (req, res, next) => {
	//Retrieve/scan devices
	if(!waiting){
		waiting = true;
		btScan()
		.then(result => {
			waiting = false;
			console.log (result);
			res.status(200).json(result);
		})
		.catch(err => {
			waiting = false;
	      	console.log(err);
	      	res.status(500).json({
	        	message: 'Internal Server Error',
	        	error: err
	      	});
	    });
	}else{
		console.log('Waiting for another request to finish');
	    res.status(err.status || 500);
	    res.json({
	      error: {
	        message: err.message,
	      }
	    });
	}
}

/* PUT */
exports.device_update = (req, res, next) => {
	if(!waiting){
		waiting = true;
		let mac = req.query.mac;
		//Check MAC format
		if(!/^([0-9A-F]{2}){6}$/.test(mac)){
			res.status(400).json({
		        message: 'Bad format: '+ mac
		   	});
		   	return
		}
		//Save uploaded image
		upload(req, res, function (err) {
			if (err){
				waiting = false;
				console.log('error:'+err);
				res.status(400).json({
			        message: 'Error uploading',
			        error: err
	   			});
	   			return
		    }
		    //Check image
		    if(!fs.existsSync(folder+fileName)){
		    	waiting = false;
				console.log('error:'+err);
				res.status(400).json({
			        message: 'Image format not valid',
			        error: err
	   			});
	   			return
	   		}
	   		//Image Processing
	   		imageProc(folder+fileName, 296, 128)
	   		.then(ok => {
	   			console.log('External update starts');
		    	//Call external program to update device
		    	updateDevice(mac, folder+fileName)
		    	.then(result => {
		    		waiting = false;
					res.status(200).json({
				        message: 'Success at updating the device: '+ mac,
				        result: result,
				        success: true
				   	});
				})
				.catch(err => {
			      	console.log(err);
			      	waiting = false;
			      	res.status(500).json({
			        	message: 'Internal Server Error',
			        	error: err
			      	});
			    });
	    		
			})
			.catch(err => {
			      	console.log(err);
			      	waiting = false;
			      	res.status(500).json({
			        	message: 'Internal Server Error',
			        	error: err
			      	});
			    });
	    	
		});
	}else{
		console.log('Waiting for another request to finish');
	    res.status(500);
	    res.json({
	      error: {
	        message: 'Waiting for another request to finish'
	      }
	    });
	}	  	
}