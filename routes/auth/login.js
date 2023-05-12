var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');

const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

router.get('/', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

router.post('/', async function(req, res, next) {
  const { username, password } = req.body;
  
  // Check if the username and password match a user in the database
  const user = await prisma.user.findUnique({ where: { username } });
  
  if (!user) {
    return res.render('login', { title: 'Login', error: 'Incorrect username or password' });
  }
  
  const validPassword = await bcrypt.compare(password, user.password);
  
  if (!validPassword) {
    return res.render('login', { title: 'Login', error: 'Incorrect username or password' });
  }
  
  // If the username and password are correct, log the user in and redirect to the home page
  req.session.user = user;
  res.redirect('/');
});

module.exports = router;