var updater;
var timer;
var time = new Date();
var baseurl = "http://192.168.178.46:8080/json.htm?"
var opbrengst
var opbrengst_dag
var opbrengst_meter = new Array;
var gebruik = new Array;
var netto
var gas

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
    updater = setInterval(getTime,60000);
    updater = setInterval(update,15000);
  }
  // draw stuff right now
  getTime()
  update();
  //count down towards first update at the beginning of a minute.
  var startTime = setInterval(startUpdate,59999-time.getMilliseconds());
}

function update(){
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
      opbrengst = JSON.parse(this.response).result[0].Usage.split(" ");
      opbrengst_dag = JSON.parse(this.response).result[0].CounterToday.split(" ");
      document.getElementById("solar_here").innerHTML = "<span class='huge'>" + opbrengst[0] + " </span> <span class='large'>" + opbrengst[1].toLowerCase() + "</span>";
      document.getElementById("vandaag_here").innerHTML = "<span class='huge'>" + opbrengst_dag[0] + " </span> <span class='large'>" + opbrengst_dag[1].toLowerCase() + "</span>";
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
      opbrengst_meter = JSON.parse(this.response).result[0].Data.split(" ");
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
      netto = JSON.parse(this.response).result[0].Data.split(" ");

      // daadwerkelijk gebruik uitrekenen
      var netto_watt = Number(netto[0])
      var opbrengst_watt = Number(opbrengst[0])
      var opbrengst_meter_watt = Number(opbrengst_meter[0])
      if (netto[1] != "Watt"){netto_watt *= 1000}
      if (opbrengst[1] != "Watt"){opbrengst_watt *= 1000}
      if (opbrengst_meter[1] != "Watt"){opbrengst_meter_watt *= 1000}
      var gebruik_watt = netto_watt + opbrengst_watt - opbrengst_meter_watt
      if (Math.sign(gebruik_watt) * gebruik_watt <= 999) {
        gebruik[0] = gebruik_watt;
        gebruik[1] = "Watt";
      } else {
        gebruik[0] = gebruik_watt/1000;
        gebruik[1] = "kW";
      }

      //netto correctie bij teruglevering
      netto_watt = gebruik_watt - opbrengst_watt
      if (netto_watt <= 999 && netto_watt >= -999 ) {
        netto[0] = netto_watt;
        netto[1] = "Watt";
      } else {
        netto[0] = netto_watt/1000;
        netto[1] = "kW";
      }

      document.getElementById("meter_gebruik_here").innerHTML = "<span class='huge'>" + gebruik[0] + " </span> <span class='large'>" + gebruik[1].toLowerCase() + "</span>";
      document.getElementById("netto_here").innerHTML = "<span class='huge'>" + netto[0] + " </span> <span class='large'>" + netto[1].toLowerCase() + "</span>";
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
