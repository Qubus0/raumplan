//timer Label stuff
var slider = document.getElementById("timeRange");
	var min = parseInt(slider.min);
	var max = parseInt(slider.max);
var label = document.getElementById("timeLabel");
var radios = document.getElementsByName("days");
var table = document.getElementsByClassName("tableizer-table")[0];
var sp = table.style;
var nowB = document.getElementById("nowB");
var playB = document.getElementById("playB");
var tableB = document.getElementById("tableB");

var identificationRow = 1;
var linesPerDayOfWeek = 14;

var fillColor = "#b40000";
var animating = false;
var date = new Date();

var fach = 0;
var found = 0;

var roomNums = [];
for (var i = 0, col; (col = table.rows[identificationRow].cells[i]); i++) {
	if (col.innerHTML != "&nbsp;" &&
		col.innerHTML != " " &&
		col.innerHTML != "" &&
		col.innerHTML != "Raumnr.") {
		roomNums.push(col.innerHTML);
	}
}



updateT();

slider.onclick = function() {
	updateT();
}

slider.oninput = function() {
	animating = false;
	updateT();
};

function updateT() {
	if(animating) {
		document.getElementById("playIcon").style.fill = "black";
	} else {
		document.getElementById("playIcon").style.fill = "none";
	}
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
			day = radios[i].value * linesPerDayOfWeek;
			//console.log(day);
			break;
		}
	}

	
	highlAll();

	function highlAll() {
		for (var i = 0; i < roomNums.length; i++) {
			highlightRoom(roomNums[i]);
		}
	}


	fach = hours - 8;

	function highlightRoom(room) {
		for (var i = 0, col; (col = table.rows[identificationRow].cells[i]); i++) {
			if (document.getElementById(room) != null && col.innerHTML.toLowerCase() == room) {
				for (var j = 0; j <= 13; j++) {
					table.rows[3 + day + j].cells[i].style.background = "none";
				}
				document.getElementById(room).style.fill = "rgba(0,0,0,0.01)";

				var current = table.rows[3 + fach + day].cells[i];
				if (current.innerHTML != "&nbsp;" &&
					current.innerHTML != " " &&
					current.innerHTML != "") {
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
	document.getElementById("playIcon").style.fill="none";
}

function animate(){
	var value = parseInt(slider.value);
	if(!animating){return;}

	if(value < max){
	slider.value = value + 1;
	} else {
	newDay();
	slider.value = min;
	}
	updateT();
	setTimeout(animate,5);
}

document.onkeydown = function(pressedKey) {
  	var value = parseInt(slider.value);
    switch (pressedKey.keyCode) {
        case 37: //left
        	pressedKey.preventDefault();
        	if(slider.value <= 9*60-1) {
        		newDay("prev");
        		slider.value = max;
        	} else {
        		slider.value = value - 60;
        	}
        	animating = false;
            break;
        case 39: //right
        	pressedKey.preventDefault();
			if(slider.value >= 20*60-1) {
        		newDay();
        		slider.value = min;
        	} else {
        		slider.value = value + 60;
        	}
			animating = false;
            break;    
        case 38: //up
        	pressedKey.preventDefault();
        	newDay("prev");
        	animating = false;
            break;
        case 40: //down
        	pressedKey.preventDefault();
        	newDay();
        	animating = false;
            break;
    }
    updateT();
};
