/* WOZiTech seneca functions */

// switch between local (test) and deployed targets for backend remote
function remoteUrl(courseId) {
    var remoteUrl = 'https://wyh917k0jg.execute-api.eu-west-1.amazonaws.com/Prod/courses/' + courseId;

	return remoteUrl;
}

// uses jquery POST to Seneca
function postSeneca() {
    console.log("Processing POST challenge");
    var totalModulesStudied = $("#totalModulesStudied").val();
    var averageScore = $("#averageScore").val();
    var timeStudied = $("#timeStudied").val();
	var courseId = $("#courseId").val();
	var userId = $("#userId").val();
	
	var postBody = { "totalModulesStudied" : totalModulesStudied,
                     "averageScore" : averageScore,
	                 "timeStudied" : timeStudied
				   };
	
    // note, the AJAX headers still apply, so the JWT Token is still relevant
    //  as is CORS processing
    $.ajax({
        url: remoteUrl(courseId),
        type: "post",
        data: JSON.stringify(postBody),
        contentType: 'application/json',
		headers : {
			"X-User-Id" : userId
		},
        processData: false,
        dataType: "json",
        timeout: 3000,
        success: function(data) {
            if (data.results && data.results.message) {
				if (data.results.message.startsWith('Successfully')) {
					$("#challengeFormSentText").text("Successfully posted");
					overlayChallengeForm();
				}
			}
        },
        error: function (jqXHR, exception) {
            alert("Failed: " + exception + ", " + jqXHR.getAllResponseHeaders());
        }
    });
}

// attach event handler to the form
$("#contactform").submit(function(event) {4
    event.preventDefault();
    contactSendEmail();
});


// resets the challenge form with empty fields
function resetChallengeForm() {
    console.log("resetting challenge form");
    
    $("#challengeForm")[0].reset();
    $("#challengeFormSent").hide();
    $("#challengeForm").show();

    $("input[type=submit]").attr("disabled", "disabled");
}


// overlays the challenge form with "results", resetting after a short delay
function overlayChallengeForm(timeout=2800) {
    console.log("overlaying challenge form");

    // hide the contact form but show the email sent overlay
    $("#challengeForm").hide();
    $("#challengeFormSent").show();

    // reset the contact form after a short delay
    setTimeout(function () {
        resetChallengeForm();
    }, timeout);
}

// attach event handler to the form
$("#challengeForm").submit(function(event) {
    event.preventDefault();
    postSeneca();
});


// attach callbacks to the form input fields
$('input[name=totalModulesStudied]').on('input',function(e){
    validateChallengeForm();
});
$('input[name=averageScore]').on('input',function(e){
    validateChallengeForm();
});
$('input[name=timeStudied]').on('input',function(e){
    validateChallengeForm();
});
$('input[name=courseId]').on('input',function(e){
    validateChallengeForm();
});
$('input[name=userId]').on('input',function(e){
    validateChallengeForm();
});

function validateChallengeForm() {
    //console.log("Validating the contact form");

	var totalModulesStudied = $("#totalModulesStudied").val();
    var averageScore = $("#averageScore").val();
    var timeStudied = $("#timeStudied").val();
	var courseId = $("#courseId").val();
	var userId = $("#userId").val();
	
    if ((totalModulesStudied.length > 0) &&
        (averageScore.length > 0) &&
        (timeStudied.length > 0) &&
        (courseId.length > 0) &&
        (userId.length > 0)) {
        // enable the button
        $("input[type=submit]").removeAttr("disabled");
    }
}

// uses jquery GET to Seneca
function getSeneca() {
    console.log("Processing GET challenge");
	var courseId = $("#getCourseId").val();
	var userId = $("#getUserId").val();
	
    // note, the AJAX headers still apply, so the JWT Token is still relevant
    //  as is CORS processing
    $.ajax({
        url: remoteUrl(courseId),
        type: "get",
		headers : {
			"X-User-Id" : userId
		},
        contentType: false,
        dataType: "json",
        processData: false,
        cache: false,
        timeout: 3000,
        success: function(data) {
            //alert(data.results)
			if (data.results.data) {
				overlayGetChallengeForm(10000, data.results.data);
			}
        },
        error: function (jqXHR, exception) {
            alert("Failed: " + exception + ", " + jqXHR.getAllResponseHeaders());
        }
    });
}

// attach event handler to the form
$("#challengeGetForm").submit(function(event) {
    event.preventDefault();
    getSeneca();
});


// resets the GET challenge form with empty fields
function resetGetChallengeForm() {
    console.log("resetting get challenge form");
    
    $("#challengeGetForm")[0].reset();
    $("#challengeGetFormSent").hide();
	$("#challengeGetResults").hide();
    $("#challengeGetForm").show();

    $("#chalengegetsubmit").attr("disabled", "disabled");
}


// overlays the challenge form with "results", resetting after a short delay
function overlayGetChallengeForm(timeout=5000, results) {
    console.log("overlaying challenge form");
	
	$("#retTotalModulesStudied").text("Total Modules Studied: " + results.totalModulesStudied);
	$("#retAverageScore").text("Average Score: " + results.averageScore);
	$("#retTimeStudied").text("Time Studied: " + results.timeStudied);

	$("#challengeGetResults").show();
    $("#challengeGetForm").hide();

    // reset the contact form after a short delay
    setTimeout(function () {
        resetGetChallengeForm();
    }, timeout);
}

$('input[name=getUserId]').on('input',function(e){
    validateGetChallengeForm();
});
$('input[name=getCourseId]').on('input',function(e){
    validateGetChallengeForm();
});

function validateGetChallengeForm() {
    //console.log("Validating the contact form");

	var courseId = $("#getCourseId").val();
	var userId = $("#getUserId").val();
	
    if ((courseId.length > 0) &&
        (userId.length > 0)) {
        // enable the button
        $("#chalengegetsubmit").removeAttr("disabled");
    }
}



