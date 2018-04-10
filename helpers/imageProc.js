var Jimp = require("jimp");
var fs = require('fs');
var tc = require('tinycolor2');

const finaltxtpath = './Uploads/image.txt'
const finalbmppath = './Uploads/imagetosend.bmp'

function processImage(imagepath, width, height) {
    return new Promise(function(resolve, reject) {
    	//Read Image
        Jimp.read(imagepath, (err, image) => {
         	console.log('Image processing starts!');
		    if (err) reject(error);
		    image = image.resize(width, height)		// resize
		        		 .greyscale()				// set greyscale
		       			 .write(finalbmppath);		// save final bmp image to send
			let count = 0;
			let binary = '';
			let hexmap = '';
			//Extract pixel information and generte hex map
			for (var i = 0; i < image.bitmap.width; i++) {
		        for (var j = image.bitmap.height; j != 0; j--) {
		        	//Pure black and white conversion
		        	//TODO: add red-color
			        let bit = tc(Jimp.intToRGBA(image.getPixelColor(i, j))).getBrightness() <= 128 ? '1' : '0';
					binary = binary + bit;
					count++;
					if (count == 8) {
						count = 0;
						hexmap = hexmap + parseInt(binary, 2).toString(16) + ' ';
						binary = '';
					}
				}
				hexmap = hexmap + '\n';
		    }
		    //Delete current
		    fs.unlink(finaltxtpath, (err) => {
			    if (err) console.log('File Not Found, creating a new one!');
			    //Save hexmap in txt file	
			    fs.appendFile(finaltxtpath, hexmap, (err) => {
					if (err) reject(err);
					console.log('Image Saved!');
					resolve(finaltxtpath);
				});
			});
		});
    })
};

module.exports = processImage;