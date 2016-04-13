var config = require('./config');
var request = require('request-promise');
var env = config.getConfig();
var url = '';
var appPassword = new Buffer('@Jacques:' + env.applicationPassword).toString('base64');

function get(path) {
  if(path === 'site-meta'){
    url = 'http://' + env.server + '/wp-json/';
    path = '';
  }

  else {
    url = 'http://' + env.server + '/wp-json/wp/v2/';
  }
  
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

function categories() {
  return get('categories?exclude=1')
    .then(function (val) {
      for (var i = 0; i < val.length; i++) {
        var category = val[i];
        if (category.name === "Podcasts") {
          var temp = category;
          val.splice(i, 1);
          val.unshift(temp);
          return val;
        }
      }
    });
}

function clean(posts) {
  for (var i = 0; i < posts.length; i++) {
    var post = posts[i];
    post.excerpt.rendered = post.excerpt.rendered.replace(/\<(?=a).*(?:a\>)/g, '');
    post.date = new Date(post.date).toLocaleDateString();
  }
  return posts;
}

var helpers = {
  get: get,
  clean: clean,
  categories: categories
};

module.exports = helpers;