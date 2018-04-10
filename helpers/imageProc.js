var Jimp = require("jimp");
var fs = require('fs');
var tc = require('tinycolor2');

const finalpath = "./Uploads/image.txt"

function processImage(imagepath, width, height) {
    return new Promise(function(resolve, reject) {
    	//Read Image
        Jimp.read(imagepath, function (err, image) {
         	console.log("Image processing starts!");
		    if (err) reject(error);
		    image = image.resize(width, height)     // resize
		        .greyscale()                		// set greyscale
		        .write("./Uploads/imagetosend.bmp");// save final image to send
			let bit;
			let count = 0;
			let binary = "";
			let hexlist = "";
			//Extract pixel information and generte hex map
			for (var i = 0; i < image.bitmap.width; i++) {
		        for (var j = image.bitmap.height; j != 0; j--) {
			          if (tc(Jimp.intToRGBA(image.getPixelColor(i, j))).getBrightness() <= 128) {
			            bit = "1";
			          } else {
			            bit ="0";
			          }
			          binary = binary + bit;
			          count++;
			          if (count == 8) {
			            count = 0;
			            hexlist = hexlist + parseInt(binary, 2).toString(16) + " ";
			            binary = "";
			          }
			        }
			        hexlist = hexlist + "\n";
		    }
		    //Delete current and save new hex file	
		    fs.unlink(finalpath, function(error) {
			    if (error) console.log('File Not Found, creating a new one!');
			    fs.appendFile(finalpath, hexlist, function (err) {
					if (err) reject(err);
					console.log('Image Saved!');
					resolve(finalpath);
				});
			});
		});
    })
};


//for (var i = 0; i < image.bitmap.width; i++) {
//		        for (var j = 0; j < image.bitmap.height; j++) {

module.exports = processImage;