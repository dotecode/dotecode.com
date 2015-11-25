$(function() {
  var navLinks = $('nav a');

  function doScroll(href) {
    if (history.pushState) {
      history.pushState({}, '', href);
    }

    $("html, body").animate(
      { scrollTop: $(href).offset().top },
      300,
      'linear',
      function(){
      });

    return false;
  }

  navLinks.on('click', function() {
    return doScroll($(this).attr('href'));
  });
  $('a.button, a.back-to-top').on('click', function() {
    return doScroll($(this).attr('href'));
  });

  $(window).on('scroll', $.throttle(200, function() {
    var bestLink = null;

    var scrollTop = $(window).scrollTop();
    if ($(window).height() + scrollTop >= $('footer').offset().top) {
      bestLink = $('#contact-link');
    }
    else {
      navLinks.each(function(i, link) {
        var $link = $(link);
        var href = $link.attr('href');

        if ($(href).offset().top <= scrollTop+200) {
          bestLink = $link;
        }
      });
    }

    if (bestLink != null && !bestLink.hasClass('selected')) {
      navLinks.removeClass('selected');
      bestLink.addClass('selected');
    }
  }));

  var feedback = $('#get-a-quote-form .feedback');
  var submit = $('#get-a-quote-form input[type="submit"]');

  $('#email, #message').on('change', function() {
    if ($(this).val() == '') {
      $(this).addClass('invalid');
    }
    else {
      $(this).removeClass('invalid');
    }
  });

  $('#get-a-quote-form').on('submit', function() {
    $.ajax($(this).attr('action'), {
      type: 'POST',
      data: {
              email: $('#email').val(),
              message: $('#message').val(),
              hash: $('#hash').val()
            },
      beforeSend: function() {
                    var email = $('#email');
                    var message = $('#message');

                    if (email.val() == '') {
                      email.addClass('invalid');
                    }
                    else {
                      email.removeClass('invalid');
                    }

                    if (message.val() == '') {
                      message.addClass('invalid');
                    }
                    else {
                      message.removeClass('invalid');
                    }

                    if (email.val() == '' || message.val() == '') {
                      feedback.text('Please enter both an email and a message.');
                      return false;
                    }

                    submit.addClass('disabled');
                    submit.prop('disabled', true);
                    feedback.text('Submitting...');
                    feedback.addClass('loading');
                  },
      error: function() {
                  submit.removeClass('disabled');
                  submit.prop('disabled', false);
                  feedback.removeClass('loading')
                    feedback.text('Submission failed. Please try again, or failing that send us an email.');
             },
      complete: function(result) {
                  submit.removeClass('disabled');
                  submit.prop('disabled', false);
                  feedback.removeClass('loading')
                  if (result.responseText == 'success') {
                    feedback.text('Your quote request was submitted - thanks! We\'ll get back to you as soon as possible.');
                  }
                  else {
                    feedback.text('Submission failed. Please try again, or failing that send us an email.');
                  }
                }
    });
    return false;
  });
});
