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
    clearInterval(startTime);
    update();
    console.log("startUpdate", time)
    updater = setInterval(update,60000);
  }
  update();
  console.log(time.getSeconds())
  var startTime = setInterval(startUpdate,(60-time.getSeconds()) * 1000);

}

function update(){
  time = new Date()

  document.getElementById('time').innerHTML = time.toLocaleTimeString([], {hour12: false, hour: '2-digit', minute:'2-digit'});
}


// Goodwe Sems solar panel api
/*function getPanel() {

  http://192.168.1.2:8080/json.htm?type=command&param=udevice&idx=$idx&nvalue=0&svalue=79


  var xhttp = new XMLHttpRequest();
  var baseurl = "http://192.168.178.46:8080/json.htm?"
  var options = ""
  options += "type=devices&rid=4"

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("solar").innerHTML = this.responseText;
    }
  };
  xhttp.open("GET", baseurl + options, true);
  //xhttp.setRequestHeader("Content-type", "text/json");
  //xhttp.setRequestHeader('token', '{"uid": "","timestamp": 0,"token": "","client": "web","version": "","language": "zh-CN" }');
  xhttp.send();



}*/
