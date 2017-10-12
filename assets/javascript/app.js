function Quiz(question, example, oknum, image) {
	this.question = question;
	this.example = example;
	this.oknum = oknum;
	this.image = image;

	this.setQuestionToHTML = function() {
		$("#question").html(this.question);
	}

	this.setExampleToHTML = function() {
		$("#example").show();
		for(var i=0; i<this.example.length; i++) {
			$("#ex"+(i+1)).text(this.example[i]);
		}

	}
}

var quizArray = [
	new Quiz("Who won super bowl 2017?",
			["Atlanta Falcons", "New England Patriots", "Dallas Cowboys", "Houston Texans"],
			2, '<iframe src="https://giphy.com/embed/l3q2WFGeobn92Aef6" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>'),
	new Quiz("In the movie \"The Wizard of Oz\", what did the Scarecrow want from the wizard?",
			["A brain", "Courage", "A heart", "Home"], 
			1, '<iframe src="https://giphy.com/embed/iluqL2zXi1PrO" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>'),
	new Quiz("What city in Australia has the highest population?",
			["Melbourne", "Austin", "Sydney", "Brisbane"], 
			3, '<iframe src="https://giphy.com/embed/14w1nWDkMYPIje" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>'),
	new Quiz("What is the most common type of pitch thrown by pitchers in baseball?",
			["Curveball", "Changeup", "Slider", "Fastball"], 
			4, '<iframe src="https://giphy.com/embed/1jk2iuzz9Knpm" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>')
];

var isGameStarted = false;
var arrPos = -1;
var wins = 0;
var losses = 0;
var unans = 0;
var timer = 0;
var timeout = 10;
var timerId;

$(document).ready(function() {
	$("#startBtn").click(startTriviaGame);

	$(".exitem").hover(function(event) {
		if(event.type === "mouseenter") {
			$(this).css("color", "#f00");
			$(this).css("border", "2px solid #f00");
		}
		else if(event.type === "mouseleave") {
			$(this).css("color", "#000");
			$(this).css("border", "none");
		}
	});

	$(".exitem").click(function() {
		clearInterval(timerId);

		if(this.value === quizArray[arrPos].oknum) {
			wins++;
			showAnswer(false, true);
		}
		else {
			losses++;
			showAnswer(false, false);
		}
	});

	function clearTriviaGame() {
		isGameStarted = false;
		arrPos = -1;
		wins = 0;
		losses = 0;
		unans = 0;
		timer = 0;
	}

	function startTriviaGame() {
		if(!isGameStarted) {
			$(this).hide();
			nextQuestion();
			isGameStarted = true;
		}
	}

	function nextQuestion() {
		arrPos++;

		if(arrPos < quizArray.length) {
			$("#quizarea").show();
			$("#ansarea").hide();
			$("#endarea").hide();

			quizArray[arrPos].setQuestionToHTML()
			quizArray[arrPos].setExampleToHTML();

			timer = 0;
			checkTimeout();
			timerId = setInterval(checkTimeout, 1000);
		}
		else {
			endTriviaGame();
		}
	}

	function checkTimeout() {
		var remained = timeout - timer;

		$("#explain").text("Time Remaining: " + remained + " Second(s)");

		if(remained <= 0) {
			clearInterval(timerId);

			unans++;
			showAnswer(true, false);
		}

		timer++;
	}

	function showAnswer(isTimeout, isCorrect) {
		$("#quizarea").hide();
		$("#ansarea").show();
		$("#endarea").hide();

		if(isTimeout) {
			$("#result").text("Out of Time!");
			$("#correct").text("The Correct Answer was: " + quizArray[arrPos].example[quizArray[arrPos].oknum-1]);
		}
		else {
			if(isCorrect) {
				$("#result").text("Correct!");
				$("#correct").html("&nbsp;");
			}
			else {
				$("#result").text("Nope!");
				$("#correct").text("The Correct Answer was: " + quizArray[arrPos].example[quizArray[arrPos].oknum-1]);
			}
		}

		$("#answer").html(quizArray[arrPos].image);
		setTimeout(nextQuestion, 5000);
	}

	function endTriviaGame() {
		$("#quizarea").hide();
		$("#ansarea").hide();
		$("#endarea").show();

		$("#ending").text("All done, heres how you did!");

		var statistics = 
			"<li>Correct Answer: " + wins + "</li>" +
			"<li>Incorrect Answer: " + losses + "</li>" +
			"<li>Unanswered: " + unans + "</li>";

		$("#endstat").html(statistics);

		clearTriviaGame();

		$("#startBtn").text("Start Over?")
		$("#startBtn").show();
	}
});

