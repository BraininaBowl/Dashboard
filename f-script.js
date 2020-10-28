//var time = new Date();
var baseurl = "http://192.168.178.46:8080/json.htm?";
var options = "type=devices";
var data = new Array;
data.meter = new Array;


window.onload = function () {
  drawAll();
}

function drawAll() {
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var items = JSON.parse(this.response).result
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
      setTimeout(drawAll, 200);
    }
  };
  xhttp.open("GET", baseurl + options, true);
  xhttp.ontimeout = function () { setTimeout(drawAll, 1000); }
  xhttp.send();
}
