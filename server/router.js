const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  // Gets either all the posts from the database or gets the posts from accounts the user follows
  app.get('/getPosts', mid.requiresLogin, controllers.Post.getPosts);
  app.get('/getFollowingPosts', mid.requiresLogin, controllers.Post.getFollowingPosts);

  // Serves the login page and handles login requests
  app.get('/login', mid.requireSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requireSecure, mid.requiresLogout, controllers.Account.login);

  // Handles signup
  app.post('/signup', mid.requireSecure, mid.requiresLogout, controllers.Account.signup);
  // Handles password change
  app.post('/changePass', mid.requireSecure, mid.requiresLogout, controllers.Account.changePass);

  // Serves the logout
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  // Serves the feed page
  app.get('/feed', mid.requiresLogin, controllers.Post.Feed);

  // Handles making post
  // Handles following
  // Handles unfollowing
  app.post('/makePost', mid.requiresLogin, controllers.Post.makePost);
  app.post('/follow', mid.requiresLogin, controllers.Account.followAccount);
  app.post('/unfollow', mid.requiresLogin, controllers.Account.unfollowAccount);

  // If the user goes to our landing page
  app.get('/', mid.requireSecure, mid.requiresLogout, controllers.Account.loginPage);

  // If page is not found return 404
  app.use((req, res) => {
    res.status(404);
    return res.render('notFound');
  });
};

module.exports = router;
