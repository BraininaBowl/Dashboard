var powerUpdater;
var startPower;
var screenClear;
var time = new Date();
var baseurl = "http://192.168.178.46:8080/json.htm?";
var lastPanelUpdate = 0;
var lastPanelTimeRounded;
var thisPanelTime;
var opbrengst_meter_watt;
var opbrengst;
var opbrengst_watt;
var gebruik = new Array;
var gebruik_watt;
var netto = new Array;
var netto_watt;
var gas;

window.onload = function () {
  document.getElementById("solar_here").innerHTML = "HOI!";
  startTimer();
}

function startTimer() {
  function powerUpdate() {
    // The panel should update any time now
    getPanel();
    // start a new timer to run every 60 seconds
    powerUpdater = setInterval(getPanel,60000);
  }
  // draw stuff right now
  getPanel();

  // get last upate from panels
  var xhttp = new XMLHttpRequest();
  var options = "type=devices&rid=16";
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      // get update time
      lastPanelUpdate = Number(JSON.parse(this.response).result[0].LastUpdate.split(" ").join('').split("-").join('').split(":").join(''));
      // get rounded update time to sync with meter data
      lastPanelTimeRounded = JSON.parse(this.response).result[0].LastUpdate.slice(0, -3);
      var lastNumber = Number(lastPanelTimeRounded.charAt(lastPanelTimeRounded.length-1));
      if (lastNumber >= 5) {
        lastNumber = 5;
      } else {
        lastNumber = 0;
      }
      lastPanelTimeRounded = lastPanelTimeRounded.slice(0, -1) + lastNumber;

      // Set updater
      var milsecsTillNextUpdate = 60000 - time.getMilliseconds() + (Number(lastPanelUpdate.toString().slice(-2))*1000);
      while (milsecsTillNextUpdate >= 60000) {
        milsecsTillNextUpdate -= 60000;
      }
      startPower = setInterval(powerUpdate,milsecsTillNextUpdate);
    }
  };
  xhttp.open("GET", baseurl + options, true);
  xhttp.send();
}

function getPanel() {
  // the solar panels get updated at the lowest frequence, so we poll them first. If the panels have been updated, we'll request the meter for the other values.
  var xhttp = new XMLHttpRequest();
  var options = "type=devices&rid=16";
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      thisPanelTime = JSON.parse(this.response).result[0].LastUpdate;
      var thisPanelUpdate = Number(thisPanelTime.split(" ").join('').split("-").join('').split(":").join(''));
      if (thisPanelUpdate > lastPanelUpdate) {
          clearInterval(startPower);
        lastPanelUpdate = thisPanelUpdate;
        opbrengst = JSON.parse(this.response).result[0].Usage.split(" ");
        opbrengst_watt = Number(opbrengst[0])
        //Watt or kW?
        if (opbrengst_watt <= 999 && opbrengst_watt >= -999) {
          opbrengst[0] = opbrengst_watt;
          opbrengst[1] = "Watt";
        } else {
          opbrengst[0] = opbrengst_watt/1000;
          opbrengst[1] = "kW";
        }
        document.getElementById("solar_here").innerHTML = "<span class='huge'>" + opbrengst[0] + " </span> <span class='large'>" + opbrengst[1].toLowerCase() + "</span>";
        getMeterOpbrengst()
        getMeterGebruik()
        getGas()
      }
    }
  };
  xhttp.open("GET", baseurl + options, true);
  xhttp.send();
}

function getMeterOpbrengst() {
  var xhttp = new XMLHttpRequest();
  var options = "type=graph&sensor=counter&idx=20&range=day&method=1";

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var items = JSON.parse(this.response).result
      for (var i = 0; i < items.length; i++){
        if (items[i].d == lastPanelTimeRounded) {
          opbrengst_meter_watt = items[i].u;
        }
      };
    }
  };
  xhttp.open("GET", baseurl + options, true);
  xhttp.send();
}

function getMeterGebruik() {
  var xhttp = new XMLHttpRequest();
  var options = "type=graph&sensor=counter&idx=19&range=day&method=1";

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var items = JSON.parse(this.response).result
      for (var i = 0; i < items.length; i++){
        if (items[i].d == lastPanelTimeRounded) {
          netto_watt = items[i].u;
        }
      };

      // daadwerkelijk gebruik uitrekenen
      gebruik_watt = netto_watt + opbrengst_watt - opbrengst_meter_watt;
      if (gebruik_watt <= 999 && gebruik_watt >= -999) {
        gebruik[0] = gebruik_watt;
        gebruik[1] = "Watt";
      } else {
        gebruik[0] = gebruik_watt/1000;
        gebruik[1] = "kW";
      }

      //netto correctie bij teruglevering
      netto_watt = gebruik_watt - opbrengst_watt;
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
  var options = "type=devices&rid=21";
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var data = JSON.parse(this.response).result[0].CounterToday.split(" ");
      document.getElementById("gas_here").innerHTML = "<span class='huge'>" + data[0] + " </span> <span class='large'>m<sup>3</sup></span>";
    }
  };
  xhttp.open("GET", baseurl + options, true);
  xhttp.send();
}
