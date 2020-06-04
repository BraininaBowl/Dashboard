var updater;
var time = new Date();
var baseurl = "http://192.168.178.46:8080/json.htm?"
var opbrengst
var gebruik

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
  getMeterOpbrengst()
  getMeterGebruik()
  getGas()
}

function getTime(){
  time = new Date()
  //kindle browser doesn't support "time.toLocaleTimeString([], {hour12: false, hour: '2-digit', minute:'2-digit'});" so I'm using another approach
  document.getElementById('time').innerHTML = time.getHours() + ":" + (time.getMinutes()<10?'0':'') + time.getMinutes() + " - " + time.toLocaleDateString();
}

function getPanel() {
  var xhttp = new XMLHttpRequest();
  var options = "type=devices&rid=16"

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var data = JSON.parse(this.response).result[0];
      document.getElementById("solar_here").innerHTML = "<span class='huge'>" + data.Usage.toLowerCase().replace(" ", " </span> <span class='large'>") + "</span>";
      document.getElementById("vandaag_here").innerHTML = "<span class='huge'>" + data.CounterToday.toLowerCase().replace(" ", " </span> <span class='large'>") + "</span>";
    }
  };
  xhttp.open("GET", baseurl + options, true);
  xhttp.send();
}

function getMeterOpbrengst() {
  var xhttp = new XMLHttpRequest();
  var options = "type=devices&rid=20"

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var data = JSON.parse(this.response).result[0].Data.split(" ");
      document.getElementById("meter_opbrengst_here").innerHTML = "<span class='huge'>" + data[0] + " </span> <span class='large'>" + data[1].toLowerCase() + "</span>";
      if (data[1] == "Watt") {
        opbrengst = Number(data[0]);
      } else {
        opbrengst = Number(data[0]) * 1000;
      }
    }
  };
  xhttp.open("GET", baseurl + options, true);
  xhttp.send();
}

function getMeterGebruik() {
  var xhttp = new XMLHttpRequest();
  var options = "type=devices&rid=19"

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var data = JSON.parse(this.response).result[0].Data.split(" ");
      document.getElementById("meter_gebruik_here").innerHTML = "<span class='huge'>" + data[0] + " </span> <span class='large'>" + data[1].toLowerCase() + "</span>";
      if (data[1] == "Watt") {
        gebruik = Number(data[0]);
      } else {
        gebruik = Number(data[0]) * 1000;
      }


      var netto = gebruik - opbrengst;
      document.getElementById("netto_here").innerHTML = "<span class='huge'>" + netto + " </span> <span class='large'>watt</span>";
    }
  };
  xhttp.open("GET", baseurl + options, true);
  xhttp.send();
}

function getGas() {
  var xhttp = new XMLHttpRequest();
  var options = "type=devices&rid=21"

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var data = JSON.parse(this.response).result[0].CounterToday.split(" ");
      document.getElementById("gas_here").innerHTML = "<span class='huge'>" + data[0] + " </span> <span class='large'>m<sup>3</sup></span>";
    }
  };
  xhttp.open("GET", baseurl + options, true);
  xhttp.send();
}
