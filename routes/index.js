var express = require('express');
var router = express.Router();
var request = require('request-promise');

var server = 'www.jacquesdukes.com';
var url = 'http://' + server + '/wordpress/dev/wp-json/wp/v2/';

var appPassword = new Buffer('@Jacques:2B53 mBHn CcHt zkXv').toString('base64');

/* GET home page. */

router.use(function (req, res, next) {
    get('categories?exclude=1,51')
        .then(function (val) {
            val.unshift({
                name: 'Podcasts',
                id: 51
            });
            res.categories = val;
            next();
        });
});

router.get('/', function (req, res, next) {
    var postURL = 'posts?per_page=5';
    var query = req.query.category;
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

            for (var i = 0; i < posts.length; i++) {
                posts[i].excerpt.rendered = posts[i].excerpt.rendered.replace(/\<(?=a).*(?:a\>)/g, '');
            }

            res.render('index', {
                title: 'The Gender Agenda',
                logo: 'img/logo.jpg',
                posts: posts,
                categories: res.categories,
                activeTab: activeTab,
                homepage: true
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
    });
});

router.get('/about/hosts', function (req, res, next) {
    var activeTab = 6;
    res.render('hosts', {
        title: 'People',
        categories: res.categories,
        activeTab: activeTab,
    });
});

router.get('/about/faq', function (req, res, next) {
    var activeTab = 6;
    res.render('faq', {
        title: 'FAQ',
        categories: res.categories,
        activeTab: activeTab,
        static: true
    });
});

router.get('/:slug', function (req, res, next) {
    var postURL = 'posts?slug=' + req.params.slug;
    get(postURL)
        .then(function (vals) {
            var post = vals[0];
            var featured_img = post.better_featured_image ? post.better_featured_image.source_url : null;
            var postCategoriesURL = 'categories?post=' + post.id;
            var postTagsURL = 'tags?post=' + post.id;
            var postAuthorURL = 'users/' + post.author;
            var postMetaURL = 'posts/' + post.id + '/meta';

            var getPostCategories = get(postCategoriesURL);
            var getPostTags = get(postTagsURL);
            var getPostAuthor = get(postAuthorURL);
            var getPostMeta =get(postMetaURL);

            Promise.all([getPostCategories, getPostAuthor, getPostTags, getPostMeta])
                .then(function (vals) {
                    var postCategories = vals[0];
                    var postAuthor = vals[1];
                    var postTags = vals[2];
                    var postMeta = vals[3];
                    res.render('post', {
                        title: post.title.rendered,
                        content: post.content.rendered,
                        img: featured_img,
                        post: post,
                        categories: res.categories,
                        author: postAuthor,
                        postCategories: postCategories,
                        postTags: postTags,
                        podcast: postMeta[0]
                    });
                });
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

module.exports = router;