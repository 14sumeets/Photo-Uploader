const express = require('express')
const app = express()
const localhostPort = 3000
const ejs = require('ejs')
const fs = require('fs')
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const templatePath = __dirname + '/index.ejs'
const PORT = process.env.PORT || localhostPort

app.use(express.static(__dirname + '/images'));
app.use(fileUpload({
    createParentPath: true
}));
app.use(bodyParser.urlencoded({extended: true}));

var templ = fs.readFileSync(templatePath, 'utf8');

app.get('/', (req, res) => {	
	res.send(ejs.render(templ, {
		images: getImages()}
))})

function getImages() {
	var images = [];
	fs.readdirSync(__dirname + '/images').forEach(function (file) {
	    // Do whatever you want to do with the file
		images.push({path: file})
	});
	console.log("images: " + images);
	return images;
}

app.post('/', (req, res) => {
	console.log('Uploaded file');
	console.log(req.files);
	let file = req.files.file;
	file.mv('./images/' + file.name);
	res.redirect('/');
})

app.post('/clear', (req, res) => {
	fs.readdirSync(__dirname + '/images').forEach(function (file) {
	        // Do whatever you want to do with the file
		fs.unlinkSync('images/' + file);
	});
	res.redirect('/');
})

app.listen(PORT, () => console.log('Image upload viewer app listening at http://localhost:${PORT}'))