window.addEventListener('load', function() {FastClick.attach(document.body);}, false);
document.addEventListener('click', function() {action();}, false);
document.addEventListener('keydown', function() {action();}, false);

//game vars
var level = 0;
var newlevel = 0;
var record = 0;
var timesplayed = 0;

//counting the played times
if(parseInt(localStorage["totalplays"],10) > 0) {
	timesplayed = parseInt(localStorage["totalplays"],10) + 1;
	localStorage["totalplays"] = timesplayed;
} else {
	localStorage["totalplays"] = 1;
	timesplayed = 1;
}

//is this a new record?
if(localStorage["maxrecord"] > 0) {
	record = localStorage["maxrecord"];
	document.getElementById("record").innerHTML = record;
} else {
	localStorage["maxrecord"] = 0;
}

//initializing the canvas
var c = document.getElementById("main");
var ctx = c.getContext("2d");


//resizing
var wW = window.innerWidth;
var wH = window.innerHeight;

if(wW > wH) {
	if(wW/400 > wH/700) {
		var ratio = wH/700;
	} else {
		var ratio = wW/400;
	}
} else {
	var ratio = wW/400;
	ratio *= window.devicePixelRatio;
}

c.width = 400 * ratio;
c.height = 700 * ratio;
c.style.marginLeft = ((wW*window.devicePixelRatio-400*ratio)/2) + 'px';
ctx.scale(ratio,ratio);

//creating the cans
var c = [];
function can(posy, speed, len) {
	this.posy = posy;
	this.speed = speed;
	this.len = len;
	this.posx = (400 - len) * Math.random();
} 
c[0] = new can(100, 70, 120);
c[1] = new can(250, 150, 130);
c[2] = new can(400, 80, 140);
c[3] = new can(550, 130, 150);

var lowercan = 4 - 1; // the one in the bottom
var oldcan = 0;

//inicializing the prince
var prince = {
	posx : 200,
	posy : 700,
	acc : 0, // acceleration
	mov : 0, // is this moving?
	jump : 0, // the height of the jump, used later...
	fall : 0, // has this passed the can height?
	on : -1, // is this on a can? wich one?
}
var p0 = document.getElementById("p0");
var p1 = document.getElementById("p1");

function main() {
	update();
	render();
}

function action() {
	if(prince.mov == 0 && newlevel == 0) {
		prince.mov = 1; // start jumping!
		prince.acc = 1; // initializing the acceleration
		prince.on = -1; // stop following the can!
	}
}

function update() {
	now = Date.now();
	interval = (now - last)/1000;
	last = now;

	//Magic. Do not touch.
	for(x=0;x<4;x++) {
		//moving the can!
		c[x].posx = (c[x].posx + c[x].speed * interval);

		//moving the prince if it is on a can
		if(x==prince.on) {
			prince.posx = (prince.posx + c[x].speed * interval);
		}

		//checking if the can has reached the wall
		if(c[x].posx + c[x].len > 400) {
			c[x].speed *= -1;
			c[x].posx = 400 - c[x].len;
		} else if(c[x].posx < 0) {
			c[x].speed *= -1;
			c[x].posx = 0;
		}
	}

	//transition between new levels
	if(newlevel > 0) {
		transitionSpeed = 4;

		newlevel -= interval*transitionSpeed;

		// pushing down the things...
		for(x=0;x<4;x++) {
			c[x].posy += interval*transitionSpeed * 150;
		}
		prince.posy += interval*transitionSpeed * 150;

		//the transition has finished!
		if(newlevel < 0) {
			// generating the new can
			var newSpeed = (level * 22 * Math.random() + 100);
			var newWidth = (130 * Math.pow(.9,level) + 50 * Math.random() + 30);
			c[oldcan] = new can(100, newSpeed, newWidth);
			newlevel = 0;
		}
	}

	if(prince.mov != 0) {
		// this code creates a quadratic equation to determine the jump
		prince.jump =  (1-(prince.acc*prince.acc)) * 180;
		// accelerating the movement
		prince.acc -= interval * 3;
		//when the prince is juuust in the can
		if(prince.acc<-.35 && prince.fall == 0) {
			// is this falling or what?
			prince.fall = 1;

			x = lowercan;
			//checks if the prince in ON the can
			if( Math.abs(prince.posx - c[x].posx - (c[x].len/2)) < c[x].len/2) {
				level++;

				if (level > record) {
					record = level;
					localStorage["maxrecord"] = record;
					document.getElementById("record").innerHTML = record;
				}

				document.getElementById('score').innerHTML = level;
				prince.mov = 0; //stoping the prince move
				prince.acc = 0;
				prince.fall = 0;
				prince.jump = 0;
				prince.posy = c[x].posy;
				prince.on = x; //this is now moving with the can

				lowercan -= 1;
				if(lowercan == -1) lowercan = 4 - 1;
				oldcan = (lowercan + 4 - 2) % 4;

				if(level>1) {
					newlevel = 1;
				}
			}
		}
		if(prince.posy - prince.jump > 800 && prince.fall == 1) {
			prince.mov = 0; prince.acc = 0;
			location.reload();
		}
	}
}

function render() {
	ctx.clearRect(0, 0, 400, 800);

	//drawin the cans
	ctx.fillStyle = "#fff";
	for(x=0;x<4;x++) {
		ctx.fillRect(c[x].posx,c[x].posy,c[x].len,12);
	}

	//drawing the prince
	if(prince.mov) {
		ctx.drawImage(p1,prince.posx-37,prince.posy-prince.jump-100,75,100)
	} else {
		ctx.drawImage(p0,prince.posx-37,prince.posy-prince.jump-100,75,100)
	}
}

last = Date.now();
setInterval(main, 1);