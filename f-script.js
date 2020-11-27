//var time = new Date();
var baseurl = "http://192.168.178.46:8080/json.htm?";
var data = new Array;
data.meter = new Array;


window.onclick = function() {
  if (document.getElementById('log').style.display == "inline-block") {
    document.getElementById('log').style.display = "none";
  } else {
    document.getElementById('log').style.display = "inline-block";
  }
}

function reloader() {
  window.location=window.location;
}

window.onload = function () {
  drawElec();
  drawGas();
  setTimeout(reloader, 240000);
}

function drawElec() {
  var xhttp = new XMLHttpRequest();
  xhttp.ontimeout = function () {
    setTimeout(drawElec, 1000);
  };
  xhttp.onload = function() {
      if (xhttp.readyState === 4) {
          if (xhttp.status === 200) {
            var items = JSON.parse(xhttp.response).result
            //kindle browser doesn't support foreach, using regular for
            for (var i = 0; i < items.length; i++){
              if (items[i].idx == 19) {
                data.usage = items[i].Data.split(/ (.*)/);
              } else if (items[i].idx == 20) {
                data.delivery = items[i].Data.split(/ (.*)/);
              } else if (items[i].idx == 16) {
                data.solar = items[i].Usage.split(/ (.*)/);
              }
            }
            if (data.usage[0] == 0) {
              data.meter[0] = data.delivery[0]
              data.meter[1] = data.delivery[1]
              data.meter[3] = "▲"
            } else {
              data.meter[0] = data.usage[0]
              data.meter[1] = data.usage[1]
              data.meter[3] = "▼"
            }
            document.getElementById("solar_here").innerHTML = "<span class='huge'><span class='unicode'>☀</span> " + Math.round(data.solar[0]) + " </span><br><span class='large'>" + data.solar[1].toLowerCase() + "</span>";
            document.getElementById("meter_gebruik_here").innerHTML = "<span class='huge'><span class='unicode'>" + data.meter[3] + "</span> " + Math.round(data.meter[0]) + " </span><br><span class='large'>" + data.meter[1].toLowerCase() + "</span>";
            setTimeout(drawElec, 200);
          } else {
            setTimeout(drawElec, 1000);
          }
      }
  };
  xhttp.open("GET", baseurl + "type=devices", true);
  xhttp.timeout = 1000;
  xhttp.send();
}


function drawGas() {
  var xhttp = new XMLHttpRequest();
  xhttp.ontimeout = function () {
    setTimeout(drawGas, 3000);
  };
  xhttp.onload = function() {
      if (xhttp.readyState === 4) {
          if (xhttp.status === 200) {
            var items = JSON.parse(xhttp.response).result
            var gas = new Array;
            //kindle browser doesn't support foreach, using regular for
            for (var i = 0; i < items.length; i++){
              gas[i] = items[i].v;
            }
            var gasmax = Math.max.apply(Math, gas);
            var gasobjects = ""

            for (var i = 1; i < items.length; i++){
              gasobjects = gasobjects + "<span class='graphbar' style='height:"+ (gas[i]/gasmax * 80 + 6) +"px'></span>"
            }
            document.getElementById("gas_here").innerHTML = gasobjects;

            setTimeout(drawGas, 1000);
          } else {
            setTimeout(drawGas, 3000);
          }
      }
  };
  xhttp.open("GET", baseurl + "type=graph&sensor=counter&idx=21&range=day", true);
  xhttp.timeout = 3000;
  xhttp.send();
}
