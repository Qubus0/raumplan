//timer Label stuff
var slider = document.getElementById("timeRange");
var label = document.getElementById("timeLabel");
var radios = document.getElementsByName("days");
var table = document.getElementsByClassName("tableizer-table")[0];
var sp = table.style;
var nowB = document.getElementById("nowB");
var playB = document.getElementById("playB");
var tableB = document.getElementById("toggleTable");

var identificationRow = 1;

var fillColor = "#b40000";
var animating = false;
var date = new Date();

var fach = 0;
var found = 0;

// table coloring stuff


updateT();

slider.onclick = function() {
	updateT();
}

slider.oninput = function() {
	animating = false;
	updateT();
};

function updateT() {
	var hours = Math.floor(slider.value / 60);
	var minutes = slider.value % 60;

	if (hours < 10 && minutes < 10) {
		label.innerHTML = "0" + hours + ":0" + minutes;
	} else if (hours < 10) {
		label.innerHTML = "0" + hours + ":" + minutes;
	} else if (minutes < 10) {
		label.innerHTML = hours + ":0" + minutes;
	} else {
		label.innerHTML = hours + ":" + minutes;
	}

	for (var i = 0; i < radios.length; i++) {
		if (radios[i].checked) {
			day = radios[i].value * 14;
			//console.log(day);
			break;
		}
	}

	var roomNums = [
		"3/0/32",
		"3/0/31",
		"3/1/2",
		"3/1/3",
		"3/1/4",
		"3/1/6",
		"3/1/9",
		"3/1/10",
		"3/1/15",
		"3/1/20",
		"3/1/21",
		"3/1/22",
		"3/1/23",
		"3/1/24",
		"3/2/2",
		"3/2/3",
		"3/2/4",
		"3/2/8",
		"3/2/11",
		"3/2/16",
		"3/2/17",
		"3/2/21",
		"3/2/24",
		"3/2/23",
		"3/2/22",
		"3/2/26",
		"3/2/27",
		"3/3/1",
		"3/3/2",
		"3/3/6",
		"3/3/8",
		"3/3/11",
		"3/3/13",
		"3/3/10",
		"5/0/6",
		"5/0/7",
		"5/0/8",
		"5/1/1",
		"5/1/2",
		"5/1/6",
		"5/1/5",
		"4/1/14",
		"4/1/26",
		"4/1/24",
		"4/1/20",
		"4/1/19",
		"4/1/15",
		"4/1/25",
		"4/0/1",
		"4/0/2",
		"4/0/3", 
		"6/0/14",
		"6/0/15"];
	highlAll();

	function highlAll() {
		for (var i = 0; i < roomNums.length; i++) {
			highlightRoom(roomNums[i]);
		}
	}


	fach = hours - 8;

	function highlightRoom(room) {
		for (var i = 0, col; (col = table.rows[identificationRow].cells[i]); i++) {
			if (col.innerHTML.toLowerCase() == room) {
				for (var j = 0; j <= 13; j++) {
					table.rows[3 + day + j].cells[i].style.background = "none";
				}
				document.getElementById(room).style.fill = "rgba(0,0,0,0.01)";

				var current = table.rows[3 + fach + day].cells[i];
				if (
					current.innerHTML != "&nbsp;" &&
					current.innerHTML != " " &&
					current.innerHTML != ""
				) {
					current.style.background = "cyan";
					document.getElementById(room).style.fill = fillColor;
				}
			}
		}
	}
}
//time label stuff end




if (sp.display == "none") {
	tableB.value = "Raumplan verstecken";
} else {
	tableB.value = "Raumplan anzeigen";
}

tableB.onclick = function() {
	if (sp.display == "none") {
		sp.display = "block";
		this.value = "Raumplan verstecken";
	} else {
		sp.display = "none";
		this.value = "Raumplan anzeigen";
	}
};

nowB.onclick = function() {
	animating = false;
	currentTime();
	updateT();
};

function currentTime() {
	var hrs = date.getHours();
	var mins = date.getMinutes();
	var day = date.getDay();
	radios[day-1].checked = true;
	slider.value = hrs * 60 + mins;
	updateT();
}

function newDay(previous) {
	var wasChecked = 0;
	for(var i=0; i<radios.length; i++) {
		if(radios[i].checked) {
			wasChecked = i;
		radios[i].checked = false;
		}
	}
	if(previous == "prev") {
	    var nextDay = wasChecked-1;
   		if(nextDay < 0) {
			nextDay = radios.length-1;
		};
	} else {
    	var nextDay = wasChecked+1;
	    if(nextDay > radios.length-1) {
			nextDay = 0;
		};
	}
	
    radios[nextDay].checked = true;
}


playB.onclick = function(){
  animating = !animating;
  animate();
}

function animate(){
  if(!animating){return;}
  var value = parseInt(slider.value);
  var min = parseInt(slider.min);
  var max = parseInt(slider.max);	
	
  if(value < max){
    slider.value = value + 1;
  } else {
    newDay();
    slider.value = min;
  }
  updateT();
  setTimeout(animate,5);
}

document.onkeydown = function(e) {
  	var value = parseInt(slider.value);
    switch (e.keyCode) {
        case 37: //left
        	e.preventDefault();
        	slider.value = value - 60;
            break;
        case 39: //right
        	e.preventDefault();
			slider.value = value + 60;
            break;    
        case 38: //up
        	e.preventDefault();
        	newDay("prev");
            break;
        case 40: //down
        	e.preventDefault();
        	newDay();
            break;
    }
    updateT();
};
