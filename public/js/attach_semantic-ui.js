var postPage = 2;
var host = window.location.host === "localhost:3000" ? window.location.host : window.location.hostname;
var postUrl = "http://" + host + "/post?per_page=5";
var form = $('#contact-form');
var response = $(".ui.response.message");
var phoneBreakpoint = 768;
var tabletBreakpoint = 992;

$(document)
    .ready(function () {

        // fix menu when passed, but not on mobile screens
        if (screen.width >= phoneBreakpoint) {
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

        form
            .form({
                fields: {
                    name: 'empty',
                    email: ['empty', 'email'],
                    subject: 'empty',
                    message: 'empty'
                }
            })
        ;

        form.submit(function (event) {
            if (form.form('is valid')) {
                $('form').addClass('loading');

                var formData = form.form('get values', ['name', 'email', 'subject', 'message']);
                var icon = response.find(".icon");
                var message = response.find(".message");
                var contact = Promise.resolve($.ajax({
                        type: 'POST',
                        url: '/contact',
                        data: formData,
                        dataType: 'json',
                        encode: true
                    }))
                    .then(function (data) {
                        icon.removeClass("remove");
                        icon.addClass("checkmark");
                        message.text('Message sent successfully');
                        response.addClass('success');
                        form.form('clear');
                    })
                    .catch(function (data) {
                        icon.removeClass("checkmark");
                        icon.addClass("remove");
                        message.text('Error sending your message');
                        response.addClass('error');
                    })
                    .then(function (data) {
                        response.show();
                        form.hide();
                        form.removeClass('loading');
                    });
            }
            event.preventDefault();
        });

        $("#reset-form").on('click', function(){
            if(form) {
                form.show();
                response.hide();
                response.removeClass('success error');
            }
        });

        $("#load-posts").click(function () {
            var loadPostbtn = $("#load-posts");
            var dimmer = $("#load-posts > .dimmer");
            var url = postUrl + '&page=' + postPage;
            var regex = /(?:\/category\/)(.*)/;
            var match = window.location.href.match(regex);
            if(!!match && match[1]) {
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
        if(content >= meta && screen.width >= tabletBreakpoint){
            $('.ui.sticky')
                .sticky({
                    context: '#content',
                    offset: 75
                })
            ;
        }
    });