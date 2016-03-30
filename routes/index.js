var express = require('express');
var router = express.Router();
var config = require('./config');
var helpers = require('./helpers');
var logo = config.logo;
var logoIcon = config.logoIcon;

var get = helpers.get;
var clean = helpers.clean;

/* GET home page. */

router.use(function (req, res, next) {
  helpers.categories()
    .then(function (val) {
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
      res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
      res.setHeader("Expires", "0"); // Proxies.
      res.categories = val;
      next();
    })
});

router.get('/', function (req, res, next) {
  var postURL = 'posts?per_page=5';

  get(postURL)
    .then(function (vals) {
      var posts = vals;

      posts = clean(posts);

      res.render('index', {
        title: 'The Gender Agenda',
        posts: posts,
        categories: res.categories,
        activeTab: -1,
        homepage: true,
        logo: logo,
        logoIcon: logoIcon
      });
    });
});

router.get('/category/:category', function (req, res, next) {
  var postURL = 'posts?per_page=5';
  var query = req.params.category;
  var activeTab = -1;

  if (query) {
    postURL += '&filter[category_name]=' + query;
  }

  get(postURL)
    .then(function (vals) {
      var posts = vals;
      for (var i = 0; i < res.categories.length; i++) {
        if (res.categories[i].name === query) {
          activeTab = i;
        }
      }

      posts = clean(posts);

      res.render('index', {
        title: 'The Gender Agenda',
        posts: posts,
        categories: res.categories,
        activeTab: activeTab,
        homepage: true,
        logo: logo,
        logoIcon: logoIcon
      });
    });
});

router.get('/about/:page', function (req, res, next) {
  var activeTab = 6;
  var query = req.params.page;
  var postURL = 'pages?slug=' + query;
  get(postURL)
    .then(function (vals) {
      var page = vals[0];
      var title = page.title.rendered;
      var content = page.content.rendered;
      res.render('post', {
        tagline: "The Gender Agenda is a radio show and podcast that examines the gender dimension aspects of Jewish life in Australia and beyond. We cover topical issues relating to health,family, career, politics, religion and cultural life from a gender perspective.",
        title: title,
        content: content,
        categories: res.categories,
        activeTab: activeTab,
        logo: logo,
        logoIcon: logoIcon
      })
    });
});

router.get('/post', function (req, res, next) {
  var postURL = 'posts?per_page=5';
  var query = req.query.category;
  var page = req.query.page;

  if (query) {
    postURL += '&filter[category_name]=' + query;
  }

  if (page) {
    postURL += '&page=' + page;
  }

  get(postURL)
    .then(function (vals) {
      var posts = vals;

      posts = clean(posts);

      res.render('site-components/post-list', {
        title: 'The Gender Agenda',
        posts: posts,
        logo: logo,
        logoIcon: logoIcon
      });
    });
});


router.get('/post/:slug', function (req, res, next) {
  var postURL = 'posts?slug=' + req.params.slug;
  get(postURL)
    .then(function (vals) {
      var post = vals[0];
      if (post) {
        var postID = post.id;
        var postCategoriesURL = 'categories?post=' + postID;
        var postTagsURL = 'tags?post=' + postID;
        var postAuthorURL = 'users/' + post.author;
        var postMetaURL = 'posts/' + postID + '/meta';

        var getPostCategories = get(postCategoriesURL);
        var getPostTags = get(postTagsURL);
        var getPostAuthor = get(postAuthorURL);
        var getPostMeta = get(postMetaURL);

        Promise.all([getPostCategories, getPostAuthor, getPostTags, getPostMeta])
          .then(function (vals) {
            var regex = /url=\"(.*?)\"/;
            var postCategories = vals[0];
            var postAuthor = vals[1];
            var postTags = vals[2];
            var postMeta = vals[3][0];
            if (postMeta) {
              postMeta = (postMeta.value.match(regex))[1];
            }
            res.render('post', {
              title: post.title.rendered,
              content: post.content.rendered,
              post: post,
              categories: res.categories,
              author: postAuthor,
              postCategories: postCategories,
              postTags: postTags,
              podcast: postMeta,
              logo: logo,
              logoIcon: logoIcon
            });
          });
      }
    });
});

module.exports = router;