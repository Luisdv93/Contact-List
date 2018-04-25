const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const passport = require('passport');
const passportLocal = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');
/* const middleware = require('./middleware'); */

/* 
=============================
            Models
=============================
*/

const Contact = require('./models/contact');
const User = require('./models/user');

/* 
=============================
            Config
=============================
*/

// Express
const app = express();
app.use(express.static('public'));

// Mongoose
mongoose.connect(
  'mongodb://luisdv93:123456@ds157639.mlab.com:57639/contact_list_test'
);

// Method Override
app.use(methodOverride('_method'));

// Express Session
app.use(
  require('express-session')({
    secret: '4Geeks Backend Test',
    resave: false,
    saveUninitialized: false
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// EJS
app.set('view engine', 'ejs');

// Body Parser
app.use(bodyParser.urlencoded({ extended: true }));

/* 
=================================
            Contact List Routes
=================================
*/

// Index Route
app.get('/contacts', (req, res) => {
  Contact.find({}, (err, contacts) => {
    if (err) {
      console.log(err);
    } else {
      res.render('index', { contacts: contacts });
    }
  });
});

// New Route
app.get('/contacts/new', (req, res) => {
  res.render('new');
});

// Create Route
app.post('/contacts', (req, res) => {
  Contact.create(req.body.contact, (err, newContact) => {
    if (err) {
      res.render('new');
    } else {
      res.redirect('/contacts');
    }
  });
});

// Show Route
app.get('/contacts/:id', (req, res) => {
  Contact.findById(req.params.id, (err, foundContact) => {
    if (err) {
      res.redirect('/contacts');
    } else {
      res.render('show', { contact: foundContact });
    }
  });
});

// Edit Route
app.get('/contacts/:id/edit', (req, res) => {
  Contact.findById(req.params.id, (err, foundContact) => {
    if (err) {
      console.log(err);
      res.redirect('/contacts');
    } else {
      res.render('edit', { contact: foundContact });
    }
  });
});

// Update Route
app.put('/contacts/:id', (req, res) => {
  Contact.findByIdAndUpdate(
    req.params.id,
    req.body.contact,
    (err, updatedContact) => {
      if (err) {
        res.redirect('/contacts');
      } else {
        res.redirect('/contacts/' + req.params.id);
      }
    }
  );
});

// Delete Route
app.delete('/contacts/:id', (req, res) => {
  Contact.findByIdAndRemove(req.params.id, err => {
    if (err) {
      res.redirect('/contacts');
    } else {
      res.redirect('/contacts');
    }
  });
});

/* 
=================================
            Auth Routes
=================================
*/

// Sign Up Routes
app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) => {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    (err, user) => {
      if (err) {
        return res.render('register');
      } else {
        passport.authenticate('local')(req, res, () => {
          res.redirect('/contacts');
        });
      }
    }
  );
});

// Login Routes
app.get('/login', (req, res) => {
  res.render('login');
});

app.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/contacts',
    failureRedirect: '/login'
  }),
  (req, res) => {}
);

// Logout Route
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/contacts');
});

/* 
=============================
            Server
=============================
*/
app.listen(3000, () => {
  console.log('Contact List listening on port 3000');
});
