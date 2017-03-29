$(function () {

'use strict';
        // error variables
        var UserError  = true,
            EmailError = true,
            SubError   = true,
            MsgError   = true;

$(".username").blur(function() {
    
    if($(this).val().length < 4){

        $(this).css('border','1px solid #F00');
        $(this).parent().find('.custom-alert').fadeIn(300).end().find('.asterix').fadeOut(300).end().find('span.cross').fadeIn(300).end().find('span.verify').fadeOut(300);
        UserError = true;
    }else{

        $(this).css('border','1px solid #080');
        $(this).parent().find('.custom-alert').fadeOut(300).end().find('.asterix').fadeOut(300).end().find('span.verify').fadeIn(300).end().find('span.cross').fadeOut(300);

        UserError = false;
    }
});



$(".email").blur(function() {
    
    if($(this).val() === ''){

        $(this).css('border','1px solid #F00');
        $(this).parent().find('.custom-alert').fadeIn(300).end().find('.asterix').fadeOut(300).end().find('span.cross').fadeIn(300).end().find('span.verify').fadeOut(300);
        EmailError = true;
    }else{

        $(this).css('border','1px solid #080');
        $(this).parent().find('.custom-alert').fadeOut(300).end().find('.asterix').fadeOut(300).end().find('span.verify').fadeIn(300).end().find('span.cross').fadeOut(300);

        EmailError = false;
    }
});

$(".subject").blur(function() {    
    if($(this).val() === ''){
        $(this).css('border','1px solid #F00');
        $(this).parent().find('.custom-alert').fadeIn(300).end().find('.asterix').fadeOut(300).end().find('span.cross').fadeIn(300).end().find('span.verify').fadeOut(300);
        SubError = true;
    }else{
        $(this).css('border','1px solid #080');
        $(this).parent().find('.custom-alert').fadeOut(300).end().find('.asterix').fadeOut(300).end().find('span.verify').fadeIn(300).end().find('span.cross').fadeOut(300);

        SubError = false;
    }
});

$(".message").blur(function() {
    if($(this).val() .length < 10){
        $(this).css('border','1px solid #F00');
        $(this).parent().find('.custom-alert').fadeIn(300).end().find('.asterix').fadeOut(300).end().find('span.cross').fadeIn(300).end().find('span.verify').fadeOut(300);
        MsgError = true;
    }else{

        $(this).css('border','1px solid #080');
        $(this).parent().find('.custom-alert').fadeOut(300).end().find('.asterix').fadeOut(300).end().find('span.verify').fadeIn(300).end().find('span.cross').fadeOut(300);
        MsgError = false;
    }
});


// submit form
$('.contact-form').submit(function(event) {
     if(UserError === true || EmailError === true || SubError === true || MsgError === true){

        event.preventDefault(); // prevent sending 
        $('.username,.email,.subject,.message').blur();
     }
});

});