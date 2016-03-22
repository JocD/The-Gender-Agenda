var express = require('express');
var router = express.Router();
var request = require('request-promise');
var config = require('./config');
var logo = {
  url: "/img/logo.png",
  title: "Gender Agenda",
  alt: "Gender Agenda"
};

var logoIcon = {
  url: "/img/logo-icon.png",
  title: "Gender Agenda",
  alt: "Gender Agenda"
};

var env = config.getConfig();

var url = 'http://' + env.server + '/wp-json/wp/v2/';

var appPassword = new Buffer('@Jacques:' + env.applicationPassword).toString('base64');

/* GET home page. */

router.use(function (req, res, next) {
  get('categories?exclude=1')
    .then(function (val) {
      for (var i = 0; i < val.length; i++) {
        var category = val[i];
        if (category.name === "Podcasts") {
          var temp = category;
          val.splice(i, 1);
          val.unshift(temp);
          res.categories = val;
          next();
        }
      }
    });
});

router.get('/', function (req, res, next) {
  var postURL = 'posts?per_page=5';

  get(postURL)
    .then(function (vals) {
      var posts = vals;

      posts = clean(posts);

      res.render('index', {
        title: 'The Gender Agenda',
        logo: 'img/logo.jpg',
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
        logo: 'img/logo.jpg',
        posts: posts,
        categories: res.categories,
        activeTab: activeTab,
        homepage: true,
        logo: logo,
        logoIcon: logoIcon
      });
    });
});

router.get('/about', function (req, res, next) {
  var activeTab = 6;
  res.render('about', {
    tagline: "The Gender Agenda is a radio show and podcast that examines the gender dimension aspects of Jewish life in Australia and beyond. We cover topical issues relating to health,family, career, politics, religion and cultural life from a gender perspective.",
    title: 'Our Story',
    categories: res.categories,
    activeTab: activeTab,
    logo: logo,
    logoIcon: logoIcon
  });
});

router.get('/about/hosts', function (req, res, next) {
  var activeTab = 6;
  res.render('hosts', {
    title: 'People',
    categories: res.categories,
    activeTab: activeTab,
    logo: logo,
    logoIcon: logoIcon
  });
});

router.get('/about/faq', function (req, res, next) {
  var activeTab = 6;
  res.render('faq', {
    title: 'FAQ',
    categories: res.categories,
    activeTab: activeTab,
    logo: logo,
    logoIcon: logoIcon
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
        logo: 'img/logo.jpg',
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
            if (vals[3][0]) {
              var postMeta = (vals[3][0].match(regex))[0];
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


function get(path) {
  options = {
    uri: url + path,
    json: true,
    headers: {
      Authorization: 'Basic ' + appPassword
    }
  };

  return request(options)
    .then(function (val) {
      return val;
    })
    .catch('Error grabbing post data from ' + url + path);
}

function clean(posts) {
  for (var i = 0; i < posts.length; i++) {
    var post = posts[i];
    post.excerpt.rendered = post.excerpt.rendered.replace(/\<(?=a).*(?:a\>)/g, '');
    post.date = new Date(post.date).toLocaleDateString();
  }
  return posts;
}

module.exports = router;