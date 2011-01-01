(function () {
	$(document).ready(function () {
		var messages = ["Nope", "Keep Trying", "Nadda", "Sorry", "No one\'s home", "Arg", "Bummer", "Faux pas", "Whoops", "Snafu", "Blunder"];
		var input = $("#startdate"), date_string = $("#your_date"), date = null;
		var input_empty = "*Enter a date like you would say it in conversation...", empty_string = "For example, 'tomorrow' or 'next friday'";
		input.val(input_empty);
		date_string.text(empty_string);
		input.keyup( 
			function (e) {
				date_string.removeClass();
				if (input.val().length > 0) {
					date = Date.parse(input.val());
					if (date !== null) {
						input.removeClass();
						date_string.addClass("accept").text(date.toString("dddd, MMMM dd, yyyy h:mm:ss tt"));
					} else {
						input.addClass("validate_error");
						date_string.addClass("error").text(messages[Math.round(messages.length * Math.random())] + "...");
					}
				} else {
					date_string.text(empty_string).addClass("empty");
				}
			}
		);
		input.focus( 
			function (e) {
				if (input.val() === input_empty) {
					input.val("");
				}
			}
		);
		input.blur( 
			function (e) {
				if (input.val() === "") {
					input.val(input_empty).removeClass();
				}
			}
		);
		var count = 1;
		$("#clickme").attr("style", $("#clickme").attr("style") + "cursor:pointer;").click( function (e) {
			if (count > 4) {
				count = 1;
			}
			$("#ninjaism").attr("src","images/ninjaism" + count + ".png");
			count++;
			e.stopPropagation();
			$(document).click( function (e) {
				$("#ninjaism").attr("src","images/shim.gif");
			});
		});
	});
}());