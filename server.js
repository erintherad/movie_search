const express = require('express');
const app = express();

// Allows app to use external js files
app.use(express.static('public'));

app.listen(process.env.PORT || 3000);

// root route (serves index.html)
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/public/views/index.html');
});
