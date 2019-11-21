/* WOZiTech functions */

// switch between local (test) and deployed targets for backend remote
function remoteUrl() {
	var remoteUrl = 'http://localhost:3000/wozitech-contact-form/';
    if (window.location.href.indexOf('wozitech') >= 0) {
        // AWS API/lambda function
        remoteUrl = ' https://ha0bthwppj.execute-api.eu-west-1.amazonaws.com/prod';
    }
    
    // test only
    remoteUrl = 'https://ha0bthwppj.execute-api.eu-west-1.amazonaws.com/prod/wozitech-contact-send-email';
    //remoteUrl = 'https://69jdbrh9vc.execute-api.eu-west-1.amazonaws.com/Prod';

	return remoteUrl;
}

// uses jquery POST to send email via AWS Lambda
function contactSendEmail() {
    console.log("Processing contact form");
    var name = $("#name").val();
    var email = $("#email").val();
    var message = $("#message").val();

    //console.log("Name: " + name);
    //console.log("Email: " + email);
    //console.log("Message: " + message);

    // note, the AJAX headers still apply, so the JWT Token is still relevant
    //  as is CORS processing
    $.ajax({
        url: remoteUrl(),
        type: "post",
        data: JSON.stringify({
            "from" : {
                "name": name,
                "email": email
               },
            "msg" : message
        }),
        contentType: 'application/json',
        processData: false,
        dataType: "json",
        timeout: 3000,
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
    //console.log("Validating the contact form");

    var name = $("#name").val();
    var email = $("#email").val();
    var message = $("#message").val();

    if ((name.length > 0) &&
        (email.length > 0) &&
        (message.length > 0)) {
        // enable the button
        $("input[type=submit]").removeAttr("disabled");
    }
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

    $("input[type=submit]").attr("disabled", "disabled");
}

// overlays the contact form with "email sent", resetting after a short delay
function overlayContactForm(timeout=2800) {
    console.log("overlaying contact form");

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
