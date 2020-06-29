const express = require('express')
const app = express()
const cloudinary = require('cloudinary').v2;
const localhostPort = 3000
const ejs = require('ejs')
const fs = require('fs')
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const templatePath = __dirname + '/index.ejs'
const PORT = process.env.PORT || localhostPort
const IMAGE_FOLDER = 'images'

// Static assets and parser setup, template file read
app.use(express.static(__dirname + '/images'));
app.use(express.static(__dirname + '/css'));
app.use(fileUpload({
    createParentPath: true
}));
app.use(bodyParser.urlencoded({extended: true}));

var templ = fs.readFileSync(templatePath, 'utf8');

// Cloudinary config
cloudinary.config({
  cloud_name: 'sumeets14',
  api_key: '757469232411646',
  api_secret: '16TPOSAYcqiX9PHD2sXVDy_rJgc'
});


// Routes setup

app.get('/', (req, res) => getImagesResponse(res))

function getImagesResponse(res) {
	cloudinary.api.resources({type: 'upload', prefix: IMAGE_FOLDER},
	  function(error, result) {
		  console.log("result: %s, error: %s", result, error);
		  var images = [];
		  if (result) {
			  result.resources.forEach(image => {
				  console.log(image);
				  images.push({url: image.url});
			  });
		  }
		  
	  	  res.send(ejs.render(templ, {
			  images: images}));
	});
}

app.post('/', (req, res) => {
	// Save image to temp location in /images
	console.log('Uploaded file');
	console.log(req.files);
	let file = req.files.file;
	file.mv('./images/' + file.name);
	
	// Now upload to cloudinary
    cloudinary.uploader.upload('./images/' + file.name, {folder:IMAGE_FOLDER},
    function(error, result) {console.log("result: %s, error: %s", result, error); });
	
	
	res.redirect('/');
})

app.post('/clear', (req, res) => {
	cloudinary.api.delete_resources_by_prefix(IMAGE_FOLDER, (error, result) => {
		if (error) {
			console.log("Error deleting all images/*")
		} else {
			console.log("Result of deleting images/*: %s", result)
		}
	    res.redirect('/');	
	});
})

app.listen(PORT, () => console.log('Image upload viewer app listening at http://localhost:%s', PORT))