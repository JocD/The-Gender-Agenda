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
                }));

                contact.then(function (data) {
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
    });