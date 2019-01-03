const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');

const users = require('./routes/api/users.js');
const profile = require('./routes/api/profile.js');
const posts = require('./routes/api/posts.js');

//Body parser middleware

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//DB Config
//const db = require("./config/keys.js").mongoURI;
const db = process.env.MONGO_URI;

//Connect to MongoDB
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log('MongoDB Conected'))
    .catch(err => console.log(err))

//Passport middleware

app.use(passport.initialize());

require('./config/passport')(passport);


app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

//Serve static assets if in production

if (process.env.NODE_ENV === 'production') {

    //Set Static Folder
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}


const port = process.env.PORT || 5000;



app.listen(port, () => console.log(`Server is runing on port${port}`));