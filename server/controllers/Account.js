const models = require('../models');

const { Account } = models;

// Serves login page
const loginPage = (req, res) => res.render('login');

// Logs out the current user
const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

// Handles what should happen when user logins(Hits login button)
const login = (req, res) => {
  // Gets username and pass from form
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  // If there is no pass or usernam error out
  if (!username || !pass) return res.status(400).json({ error: 'All fields are required' });

  // Attempts to login the user
  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account) return res.status(401).json({ error: 'Wrong username or password!' });

    // Attaches them to current session
    req.session.account = Account.toAPI(account);

    // Takes them to the feed page if this is successful
    return res.json({ redirect: '/feed' });
  });
};

// Handles a user signing up
const signup = async (req, res) => {
  // Gets username and passwords
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  // The user can only be verified if they check the box equivalent
  // of putting in credit card details
  const verified = req.body.creditCard;

  // If they don't have username or passswords error out
  if (!username || !pass || !pass2) { return res.status(400).json({ error: 'All fields are required' }); }

  // Error out if the passwords don't match
  if (pass !== pass2) { return res.status(400).json({ error: 'Passwords do not match!' }); }

  try {
    // Hashes the password for storing on server
    const hash = await Account.generateHash(pass);

    // Creates the new account using password usernam and verified value
    const newAccount = new Account({ username, password: hash, verified });
    await newAccount.save();

    // Sets them to the account in session and takes them to the feed page
    req.session.account = Account.toAPI(newAccount);
    return res.json({ redirect: '/feed' });
  } catch (err) {
    console.log(err);
    // Errors out if the account already exists
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username already in use!' });
    }
    return res.status(500).json({ error: 'An error occured!' });
  }
};

// Handles trying to change password
const changePass = (req, res) => {
  // Similar to creating an account just also has old pass
  const username = `${req.body.username}`;
  const oldPass = `${req.body.oldPass}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  // If any of these values aren't there error out
  if (!username || !pass || !pass2 || !oldPass) { return res.status(400).json({ error: 'All fields are required' }); }

  // Trys to get the account
  return Account.authenticate(username, oldPass, async (err, account) => {
    if (err || !account) return res.status(401).json({ error: 'Wrong username or password!' });

    // If pass one and 2 don't match error out
    if (pass !== pass2) { return res.status(400).json({ error: 'Passwords do not match!' }); }

    try {
      // Attempts to update account
      const hash = await Account.generateHash(pass);
      const updated = await Account.findOneAndUpdate(
        { username },
        { password: hash },
        { new: true },
      );

      // Logs that account to the session and sends them to the feed page
      req.session.account = Account.toAPI(updated);
      return res.json({ redirect: '/feed' });
    } catch (er) {
      console.log(er);
      return res.status(500).json({ error: 'An error occured!' });
    }
  });
};

// Attempts to unfollow the account
const unfollowAccount = async (req, res) => {
  try {
    // Finds and updates the account to remove the posters id
    await Account.updateOne(
      { _id: req.session.account._id },
      { $pull: { following: req.body.accountFollow } },
    );
    return res.status(204).end();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'An error occured!' });
  }
};

// Handles following an account
const followAccount = async (req, res) => {
  try {
    // Finds the current account add the posters id to the follower list and updates
    const currentUser = await Account.findOne({ username: req.session.account.username }).exec();
    currentUser.following.push(req.body.accountFollow);
    await currentUser.save();
    return res.status(204).end();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'An error occured!' });
  }
};

module.exports = {
  loginPage,
  login,
  logout,
  signup,
  changePass,
  followAccount,
  unfollowAccount,
};
