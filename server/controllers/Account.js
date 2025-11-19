const models = require('../models');

const { Account } = models;

const loginPage = (req, res) => res.render('login');

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  if (!username || !pass) return res.status(400).json({ error: 'All fields are required' });

  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account) return res.status(401).json({ error: 'Wrong username or password!' });

    req.session.account = Account.toAPI(account);

    return res.json({ redirect: '/maker' });
  });
};

const signup = async (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  if (!username || !pass || !pass2) { return res.status(400).json({ error: 'All fields are required' }); }

  if (pass !== pass2) { return res.status(400).json({ error: 'Passwords do not match!' }); }

  try {
    const hash = await Account.generateHash(pass);
    const newAccount = new Account({ username, password: hash });
    await newAccount.save();
    req.session.account = Account.toAPI(newAccount);
    return res.json({ redirect: '/maker' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username already in use!' });
    }
    return res.status(500).json({ error: 'An error occured!' });
  }
};

const changePass = (req, res) => {
  const username = `${req.body.username}`;
  const oldPass = `${req.body.oldPass}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  if (!username || !pass || !pass2 || !oldPass) { return res.status(400).json({ error: 'All fields are required' }); }

  return Account.authenticate(username, oldPass, async (err, account) => {
    if (err || !account) return res.status(401).json({ error: 'Wrong username or password!' });

    if (pass !== pass2) { return res.status(400).json({ error: 'Passwords do not match!' }); }

    try {
      const hash = await Account.generateHash(pass);
      const updated = await Account.findOneAndUpdate(
        { username },
        { password: hash },
        { new: true },
      );
      req.session.account = Account.toAPI(updated);
      return res.json({ redirect: '/maker' });
    } catch (er) {
      console.log(er);
      return res.status(500).json({ error: 'An error occured!' });
    }
  });
};

module.exports = {
  loginPage,
  login,
  logout,
  signup,
  changePass,
};
