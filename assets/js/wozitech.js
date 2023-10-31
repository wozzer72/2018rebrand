/* WOZiTech functions */

// switch between local (test) and deployed targets for backend remote
function remoteUrl() {
	var remoteUrl = 'https://4s2oupu8mh.execute-api.eu-west-1.amazonaws.com/dev/sendContactEmail';

    if (window.location.href.indexOf('wozitech-ltd') >= 0) {
        // AWS API/lambda function
        remoteUrl = 'https://4s066isqtc.execute-api.eu-west-1.amazonaws.com/prod/sendContactEmail';
    }

    return remoteUrl;
}
    
// uses jquery POST to send email via AWS Lambda
function contactSendEmail() {
    console.log("Processing contact form");
    var name = $("#name").val();
    var email = $("#email").val();
    var message = $("#message").val();

    // note, the AJAX headers still apply, so the JWT Token is still relevant
    //  as is CORS processing
    $.ajax({
        url: remoteUrl(),
        type: "post",
        data: JSON.stringify({
            name,
            email,
            message
        }),
        contentType: 'application/json',
        headers: {},
        processData: false,
        dataType: "json",
        timeout: 10000,
        success: function(data) {
            $("#contactformsenttext").text("Thank you - email has been sent to us. We will be in touch shortly.");
            overlayContactForm();
        },
        error: function (jqXHR, exception) {
            console.log(exception);
            $("#contactformsenttext").text("An error occurred - please try again later or send an email yourself.");
            overlayContactForm(3500);
        }
    });
}

// called every time a change is made to one of the contact
//  form elements, ensuring they are "as expected" and then
//  enabling the "Send Message" button
function validateContactForm() {
    const emailRegex = /\S+@\S+\.\S\S+/;    // at least two characters for the domain

    var name = $("#name").val();
    var email = $("#email").val();
    var message = $("#message").val();

    if ((name.length > 0) &&
        (email.length > 0) &&
        (message.length > 0 && message.length < 500) &&
        emailRegex.test(email)) {
        // enable the button
        $("input[type=submit]").removeAttr("disabled");
    } else {
        $("input[type=submit]").attr("disabled", true);
    }
}

function showRemainingCharacters() {
    const maxLength = 500;
    const currentLength = $("#message").val().length;
    const remaining = maxLength-currentLength-1;    // minus 1 because the keydown event will add one more character
    $("#messageLabel").text(`Message (${remaining} characters remaining`);
}

// attach callbacks to the form input fields
$('input[name=name]').on('input',function(e){
    validateContactForm();
});
$('input[name=email]').on('input',function(e){
    validateContactForm();
});
$('#message').keydown(function (event) {
    validateContactForm();
    showRemainingCharacters();
});

// override the form reset to ensure the submit button is disabled
$("input[type='reset']").on("click", function(e) {
    e.preventDefault();
    resetContactForm();
});

// resets the contact form with empty fields
function resetContactForm() {
    console.log("resetting contact form");
    
    $("#contactform")[0].reset();
    $("#contactformsent").hide();
    $("#contactform").show();

    $("#messageLabel").text(`Message (500 characters remaining`);

    $("input[type=submit]").attr("disabled", "disabled");
}

// overlays the contact form with "email sent", resetting after a short delay
function overlayContactForm(timeout=2800) {
    // hide the contact form but show the email sent overlay
    $("#contactform").hide();
    $("#contactformsent").show();

    // reset the contact form after a short delay
    setTimeout(function () {
        resetContactForm();
    }, timeout);
}

// attach event handler to the form
$("#contactform").submit(function(event) {4
    event.preventDefault();
    contactSendEmail();
});
