var powerUpdater;
var startPower;
var screenClear;
var time = new Date();
var baseurl = "http://192.168.178.46:8080/json.htm?";
var lastPanelUpdate;
var opbrengst_meter_watt;
var gebruik_meter_watt
var opbrengst = new Array;
var opbrengst_watt;
var gebruik = new Array;
var gebruik_watt;
var netto = new Array;
var netto_watt;
var gas;
var powerUpdater;

window.onload = function () {
  startTimer();
}

function startTimer() {
  // draw stuff right now
  getPanel()

  // get time to next update
  var lastNumberMinutes = time.getMinutes() % 10
  //var lastNumberMinutes = Number(minutes.charAt(minutes.length-1));
  if (lastNumberMinutes >= 5) {
    lastNumberMinutes -= 5;
  }

  clearInterval(powerUpdater);
  powerUpdater = setInterval(getPanel, 299000 - (time.getMilliseconds() + (time.getSeconds()*1000) + (lastNumberMinutes*1000*60)));
}

function getPanel() {
  var xhttp = new XMLHttpRequest();
  var options = "type=graph&sensor=counter&idx=16&range=day&method=1";
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      opbrengst_watt = 0
      var i = 1
      var items = JSON.parse(this.response).result

      while  (opbrengst_watt == 0) {
        if (items[items.length - i].v) {
          thisPanelUpdate = items[items.length - i].d;
          if (thisPanelUpdate != lastPanelUpdate) {
            // data has updated
            lastPanelUpdate = thisPanelUpdate;
            opbrengst_watt = Number(items[items.length - i].v)
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

            // update again in five minutes
            clearInterval(powerUpdater);
            powerUpdater = setInterval(getPanel,299000);
          } else {
            //data hasn't updated yet, trying again in a second
            clearInterval(powerUpdater);
            powerUpdater = setInterval(getPanel,1000);
          }
        } else {
          i += 1;
        }
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
      //kindle browser doesn't support foreach, using regular for here
      var items = JSON.parse(this.response).result
      for (var i = 0; i < items.length; i++){
        if (items[i].d == lastPanelUpdate) {
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
      //kindle browser doesn't support foreach, using regular for here
      var items = JSON.parse(this.response).result
      for (var i = 0; i < items.length; i++){
        if (items[i].d == lastPanelUpdate) {
          gebruik_meter_watt = items[i].u;
        }
      };

      // daadwerkelijk gebruik uitrekenen
      gebruik_watt = gebruik_meter_watt + opbrengst_watt - opbrengst_meter_watt;
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
