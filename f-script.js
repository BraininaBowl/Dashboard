var updater;
var time = new Date();
var body = document.documentElement;

window.onload = function () {
  //openFullscreen();
  startTimer()
  //getPanel()
}


function startTimer() {
  function startUpdate() {
    // we're at the first second of a minute
    //stop the countdown
    clearInterval(startTime);
    // update everything
    update();
    // start a new timer to run every 60 seconds
    updater = setInterval(update,60000);
  }
  // draw stuff right now
  update();
  //count down towards first update at the beginning of a minute.
  var startTime = setInterval(startUpdate,59999-time.getMilliseconds());
}

function update(){
  getTime()
  getPanel()
}

function getTime(){
  time = new Date()
  //kindle browser doesn't support "time.toLocaleTimeString([], {hour12: false, hour: '2-digit', minute:'2-digit'});" so I'm using another approach
  document.getElementById('time').innerHTML = time.getHours() + ":" + (time.getMinutes()<10?'0':'') + time.getMinutes() + " - " + time.toLocaleDateString();
}

function getPanel() {


  /*
  var xhttp = new XMLHttpRequest();
  var baseurl = "http://192.168.178.46:8080/json.htm?"
  var options = ""
  options += "type=command&param=udevice&idx=16&nvalue=0&svalue=POWER;ENERGY"

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("solar").innerHTML = this.responseText.POWER;
    }
  };
  xhttp.open("GET", baseurl + options, true);
  xhttp.send();
  */
}
