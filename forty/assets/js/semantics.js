/* WOZiTech Semantic Integration functions */

// switch between local (test) and deployed targets for backend remote
function remoteUrl(question) {
    //var remoteUrl = 'https://wit-weddingserve.wozitech.click/semantics/SemanticDBpedia?question?' + escape(question);
    var remoteUrl = 'http://localhost:3000/semantics/SemanticDBpedia?question=' + escape(question);

    var remoteUrl = 'http://wit.wozitech.click/wit-weddingserve/semantics/SemanticDBpedia?question=' + escape(question);

	return remoteUrl;
}

// uses jquery GET to Semantics
function getSemantics() {
    console.log("Processing GET challenge");
    var question = $("#question").val();

    // if question has not been asked
    if (Number(question) === 0) {
        // do nothing
        return;
    }

    // known set of questions
    const ourQuestions = [
        "How old is Tony Blair?",
        "Where was David Cameron born?"
    ];

    const theRemoteUrl = remoteUrl(ourQuestions[Number(question)-1]);


    // note, the AJAX headers still apply, so the JWT Token is still relevant
    //  as is CORS processing
    $.ajax({
        url: theRemoteUrl,
        type: "get",
        contentType: false,
        dataType: "json",
        processData: false,
        cache: false,
        timeout: 3000,
        success: function(data) {
			if (data.status === "success") {
				overlayGetChallengeForm(5000, data.age);
			} else {
                overlayGetChallengeForm(5000, "unexpected");
            }
        },
        error: function (jqXHR, exception) {
            //alert("Failed: " + exception + ", " + jqXHR.getAllResponseHeaders());
        }
    });
}

// attach event handler to the form
$("#challengeGetForm").submit(function(event) {
    event.preventDefault();
    getSemantics();
});


// resets the GET challenge form with empty fields
function resetGetChallengeForm() {
    console.log("resetting get challenge form");
    
    $("#challengeGetForm")[0].reset();
    $("#challengeGetFormSent").hide();
	$("#challengeGetResults").hide();
    $("#challengeGetForm").show();
}


// overlays the challenge form with "results", resetting after a short delay
function overlayGetChallengeForm(timeout=5000, results) {
    console.log("overlaying challenge form");

    if (results==="unexpected") {
        $("#retAge").text("I do not understand");
    } else {
        $("#retAge").text("Age: " + results);
    }

    $("#challengeGetResults").show();
    $("#challengeGetForm").hide();

    // reset the contact form after a short delay
    setTimeout(function () {
        resetGetChallengeForm();
    }, timeout);
}
