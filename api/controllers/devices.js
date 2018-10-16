var multer = require('multer'); 
var fs = require('fs');

const btScan = require('../../calls/btScan.js');
const updateDevice = require('../../calls/updateDevice.js');
const imageProc = require('../../helpers/imageProc.js');

//Paths
var folder = './Uploads/';
var fileName = 'image.bmp';

//MAC Validation
var macRegex = RegExp(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/);

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

//Storage and filter by filename
var upload = multer({ 
	storage: Storage,
	fileFilter: function (req, file, callback) {
        if(!file.originalname == fileName) return callback(new Error('Image not found/Bad filename'))
        callback(null, true)
    }
}).single('image'); 

/* GET */
exports.devices_get_all = (req, res, next) => {
	//Retrieve/scan devices
	if(!waiting){
		waiting = true;
		btScan()
		.then(result => {
			waiting = false;
			console.log(result);
			//JSON error handling(only for testing)
			try {
				result = JSON.parse(result);
			} catch (e) {
				res.status(200).end(result);
				return
			}
			res.status(200).json(result);
		})
		.catch(err => {
			waiting = false;
			res.status(500).json({error: {message: err.message}});
	    });
	}else{
		console.log('Waiting for another request to finish');
	    res.status(500).json({error: {message: 'Waiting for another request to finish'}});
	}
}

/* PUT

EXAMPLE:

PUT /devices/?mac=00:0B:57:0B:E2:62 HTTP/1.1
Host: localhost:5000
Cache-Control: no-cache
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW

------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="image"; filename="image.bmp"
Content-Type: image/bmp


------WebKitFormBoundary7MA4YWxkTrZu0gW--
*/
exports.device_update = (req, res, next) => {
	if(!waiting){
		waiting = true;
		let mac = req.query.mac;
		//Check MAC format
		if(!macRegex.test(mac)){
			waiting = false;
			res.status(400).json({error: {message: 'Bad format: '+ mac}});
		   	return
		}
		//Save uploaded image
		upload(req, res, function (err) {
			if (err){
				waiting = false;
				console.log('error:'+err);
				res.status(500).json({error: {message: 'Error uploading', error: err}});
	   			return
		    }
		    //Check image
		    if(req.file == undefined){
		    	waiting = false;
				res.status(400).json({error: {message: 'Image format not valid', error: err}});
	   			return
	   		}
	   		//Image Processing
	   		imageProc(folder+fileName, 296, 128)
	   		.then(ok => {
	   			console.log('External update starts to MAC: '+ mac);
		    	//Call external program to update device
		    	updateDevice(mac, folder+fileName)
		    	//RESULT
		    	.then(result => {
		    		waiting = false;
					res.status(200).json({
				        message: 'Success at updating the device: '+ mac,
				        result: result,
				        success: true
				   	});
				})
				.catch(err => {
			       waiting = false;
			      	res.status(500).json({
			      		success: false,
			        	message: 'Device update failed',
			        	error: err
			      	});
			    });
	    		
			})
			.catch(err => {
			      	waiting = false;
			      	res.status(500).json({
			        	message: 'Internal Server Error',
			        	error: err
			      	});
			    });
	    	
		});
	} else {
		console.log('Waiting for another request to finish');
	    res.status(500).json({error:'Waiting for another request to finish'});
	}  	
}