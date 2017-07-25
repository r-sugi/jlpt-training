jQuery(document).ready(function(){
  var questions  = [];
  var progress   = 0;
  var intervalId = 0;
  var timeoutSec = 20;

  function setMessage(bool) {
    var message = jQuery("p#message")
      .html(bool ? "Correct" : "Incorrect").show();
    jQuery("form div.form-group")
      .removeClass("has-success")
      .removeClass("has-error")
      .addClass(bool ? "has-success" : "has-error");
    var timeoutId = setTimeout(function(){
      message.html("").fadeOut();
      jQuery("form div.form-group")
        .removeClass("has-success")
        .removeClass("has-error");
    }, 900);
  }
  function getQuestion() {
    //return questions[Math.floor(Math.random()*questions.length)];
    if ((progress + 1) <= questions.length)
      return questions[progress++];
    else
      return false;
  }
  function setQuestion() {
    clearInterval(intervalId);
    var q = getQuestion();
    var l = timeoutSec;
    var question  = jQuery("#question");
    var answer    = jQuery("#answer");
    var timelimit = jQuery("#timelimit");
    if (q === false) {
      timelimit.html("");
      jQuery("#question").html("おつかれさまでした");
      endOfTraining();
    } else {
      question.html(q[0]);
      answer.val("");
      answer.focus();
      timelimit.html("Time remining " + l + " sec...");
      intervalId = setInterval(function(){
        if (--l < 1) {
          clearInterval(intervalId);
          timelimit.html("Time out... The correct answer is <mark>" + q[1] + "</mark>.");
          answer.hide();
          jQuery("#resume-questions").show();
          jQuery("#backtomenu-section").show();
          jQuery("#navbar-bottom-credit").show();
          jQuery("#navbar-bottom-exit").hide();
          jQuery("#jlpt-navbar").show();
        } else {
          timelimit.html("Time remining " + l + " sec...");
        }
      }, 1000);
      jQuery("form#nandoku").bind("submit", function(){
        if (answer.val()===q[1]) {
          clearInterval(intervalId);
          setMessage(true);
          setQuestion();
        } else if (answer.val() !== "") {
          setMessage(false);
        }
        return false;
      });
    }
  }

  function initiateTrainig(anchor) {
    jQuery("div#navigation-container").hide();
    jQuery("div#training-container").show();
    jQuery("#navbar-bottom-credit").hide();
    jQuery("#navbar-bottom-exit").show();
    jQuery("#jlpt-navbar").hide();
    jQuery
      .ajax({ url:"./assets/" + anchor.getAttribute('data-object') + ".csv" })
      .success(function(csv){
        var lines = shuffle(csv.split(/\r\n|\r|\n/)), line = [];
        console.log(csv, lines);
        for (var i in lines) {
          if (questions.length > 9)
            continue;
          line = lines[i].split(",", 2);
          if (line.length === 2 && line[0].length > 0 && line[1].length > 0)
            questions[questions.length] = line;
        }
        if (questions.length > 0)
          setQuestion();
      });
  }
  function endOfTraining() {
    jQuery("#answer-section").hide();
    jQuery("#resume-questions").show();
    jQuery("#backtomenu-section").show();
    jQuery("#navbar-bottom-credit").show();
    jQuery("#navbar-bottom-exit").hide();
    jQuery("#jlpt-navbar").show();
  }
  function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }
  var trainings = ["jlpt-n5", "jlpt-n4"]; //, "jlpt-n3", "jlpt-n2", "jlpt-n1"]
  for (var courseId in trainings) {
    jQuery("a#init-" + trainings[courseId]).bind("click", function(){
      initiateTrainig(this);
    });
  }
});
