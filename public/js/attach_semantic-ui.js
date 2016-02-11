var postPage = 2;
var host = window.location.host === "localhost:3000" ? window.location.host : window.location.hostname;
var postUrl = "http://" + host + "/posts?per_page=5";
$(document)
    .ready(function () {

        // fix menu when passed, but not on mobile screens
        if (screen.width >= 768) {
            $('.masthead')
                .visibility({
                    once: false,
                    onBottomPassed: function () {
                        $('.fixed.menu').transition('fade in');
                    },
                    onBottomPassedReverse: function () {
                        $('.fixed.menu').transition('fade out');
                    }
                });
        }


        // create sidebar and attach to menu open
        $('.ui.sidebar')
            .sidebar('attach events', '.toc.item');

        // activate Semantic-UI dropdown menus
        $('.ui.dropdown')
            .dropdown();

        $('.ui.form')
            .form({
                fields: {
                    name: 'empty',
                    email: ['empty', 'email'],
                    subject: 'empty',
                    message: 'empty'
                }
            })
        ;

        $('.ui.form').submit(function (event) {
            if ($('.ui.form').form('is valid')) {
                $('.ui.dimmer').addClass('active');

                var formData = {
                    'name': $('input[name=name]').val(),
                    'email': $('input[name=email]').val(),
                    'subject': $('input[name=subject]').val(),
                    'message': $('textarea[name=message]').val()
                };

                var contact = Promise.resolve($.ajax({
                        type: 'POST',
                        url: '/contact',
                        data: formData,
                        dataType: 'json',
                        encode: true
                    }))
                    .then(function (data) {
                        $('.submit-success').show();
                        $('.submit-failure').hide();
                    })
                    .catch(function (data) {
                        $('.submit-success').hide();
                        $('.submit-failure').show();
                    })
                    .then(function (data) {
                        $('#contact-form').hide();
                        $('.contact.response').transition('fade in');
                        $('.ui.dimmer').removeClass('active');
                    });
            }
            event.preventDefault();
        });

        $("#load-posts").click(function () {
            var loadPostbtn = $("#load-posts");
            var dimmer = $("#load-posts > .dimmer");
            var url = postUrl + '&page=' + postPage;
            var regex = /(?:category=)(.*)/;
            var match = window.location.href.match(match);
            if(match[1]) {
                var category = match[1];
            }
            dimmer.addClass("active");

            if(category){
                url += '&category=' + category;
            }

            var posts = Promise.resolve($.ajax({
                    type: 'GET',
                    url: url,
                    dataType: 'html',
                    encode: true
                }))
                .then(function (data) {

                    if (data !== "") {
                        loadPostbtn.before(data);
                        postPage++;
                    }

                    else {
                        loadPostbtn.text('No More Posts');
                        loadPostbtn.addClass("disabled");
                    }
                    dimmer.removeClass("active");
                    $('.ui.sticky')
                        .sticky('refresh')
                    ;
                })
                .catch(function (err) {
                    loadPostbtn.text("Can't load posts right now");
                    loadPostbtn.addClass("disabled");
                    dimmer.removeClass("active");
                })
        });

        var meta = $("#meta").height();
        var content = $("#post-list").height();
        if(content >= meta){
            $('.ui.sticky')
                .sticky({
                    context: '#content',
                    offset: 75
                })
            ;
        }
    });