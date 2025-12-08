const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getPosts', mid.requiresLogin, controllers.Post.getPosts);

  app.get('/login', mid.requireSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requireSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requireSecure, mid.requiresLogout, controllers.Account.signup);
  app.post('/changePass', mid.requireSecure, mid.requiresLogout, controllers.Account.changePass);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/feed', mid.requiresLogin, controllers.Post.Feed);
  app.post('/makePost', mid.requiresLogin, controllers.Post.makePost);
  app.post('/follow', mid.requiresLogin, controllers.Account.followAccount);
  app.post('/unfollow', mid.requiresLogin, controllers.Account.unfollowAccount);

  // app.get('/maker', mid.requiresLogin, controllers.Domo.makerPage);
  // app.post('/maker', mid.requiresLogin, controllers.Domo.makeDomo);
  app.get('/', mid.requireSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
