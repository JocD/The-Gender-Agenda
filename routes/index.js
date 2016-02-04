var express = require('express');
var router = express.Router();
var request = require('request-promise');

var url = 'http://www.jacquesdukes.com';
/* GET home page. */

router.get('/', function (req, res, next) {
    var postURL = '/wordpress/dev/wp-json/wp/v2/posts?per_page=5';
    var categoryURL = '/wordpress/dev/wp-json/wp/v2/categories';
    var query = req.query.category;
    var activeTab = -1;

    if (query) {
        postURL += '&filter[category_name]=' + query;
    }

    var postData = get(postURL);
    var categoryData = get(categoryURL);

    Promise.all([postData, categoryData])
        .then(function (vals) {
            var posts = vals[0];
            var categories = vals[1];
            for (var i = 0; i < vals[1].length; i++) {
                if (vals[1][i].name === query) {
                    activeTab = i;
                }
            }

            res.render('index', {
                title: 'The Gender Agenda',
                logo: 'img/logo.jpg',
                posts: posts,
                categories: categories,
                activeTab: activeTab,
                homepage: true
            });
        });
});

router.get('/about', function (req, res, next) {
    var categoryURL = '/wordpress/dev/wp-json/wp/v2/categories';
    var categoryData = get(categoryURL);
    var activeTab = 6;

    Promise.all([categoryData])
        .then(function (vals) {
            var categories = vals[0];
            res.render('about', {
                tagline: "The Gender Agenda is a radio show and podcast that examines the gender dimension aspects of Jewish life in Australia and beyond. We cover topical issues relating to health,family, career, politics, religion and cultural life from a gender perspective.",
                title: 'Our Story',
                categories: categories,
                activeTab: activeTab,
                static: true
            });
        });
});

router.get('/about/hosts', function (req, res, next) {
    var categoryURL = '/wordpress/dev/wp-json/wp/v2/categories';
    var categoryData = get(categoryURL);
    var activeTab = 6;

    Promise.all([categoryData])
        .then(function (vals) {
            var categories = vals[0];
            res.render('hosts', {
                title: 'People',
                categories: categories,
                activeTab: activeTab,
                static: true
            });
        });
});

router.get('/about/faq', function (req, res, next) {
    var categoryURL = '/wordpress/dev/wp-json/wp/v2/categories';
    var categoryData = get(categoryURL);
    var activeTab = 6;

    Promise.all([categoryData])
        .then(function (vals) {
            var categories = vals[0];
            res.render('faq', {
                title: 'FAQ',
                categories: categories,
                activeTab: activeTab,
                static: true
            });
        });
});

router.get('/:slug', function (req, res, next) {
    var postURL = '/wordpress/dev/wp-json/wp/v2/posts?filter[name]=' + req.params.slug;
    var categoryURL = '/wordpress/dev/wp-json/wp/v2/categories';

    var postData = get(postURL);
    var categoryData = get(categoryURL);

    Promise.all([postData, categoryData])
        .then(function (vals) {
            var posts = vals[0];
            var post = posts[0];
            var categories = vals[1];
            var featured_img = post.better_featured_image ? post.better_featured_image.source_url : null;
            var postCategoriesURL = '/wordpress/dev/wp-json/wp/v2/posts/' + post.id + '/categories';
            var postTagsURL = '/wordpress/dev/wp-json/wp/v2/posts/' + post.id + '/tags';
            var postAuthorURL = '/wordpress/dev/wp-json/wp/v2/users/' + post.author;

            var getPostCategories = get(postCategoriesURL);
            var getPostTags = get(postTagsURL);
            var getPostAuthor = get(postAuthorURL);

            Promise.all([getPostCategories, getPostAuthor, getPostTags])
                .then(function (vals) {
                    var postCategories = vals[0];
                    var postAuthor = vals[1];
                    var postTags = vals[2];
                    res.render('post', {
                        title: post.title.rendered,
                        content: post.content.rendered,
                        img: featured_img,
                        post: post,
                        categories: categories,
                        author: postAuthor,
                        postCategories: postCategories,
                        postTags: postTags
                    });
                });
        });
});


function get(path) {
    options = {
        uri: url + path,
        json: true
    };

    return request(options)
        .then(function (val) {
            return val;
        })
        .catch('Error grabbing post data from ' + url + path);
}

module.exports = router;