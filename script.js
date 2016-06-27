/*
Ball animation with Motion detector
Frédérik Ganninger de Botmiliau, 2016
This App was tested on a Samsung s5 mini, on Chrome 51.0.2704.81, Android 4.4.2
*/

var ctx;
var x=100;
var y=200;
var dx=5;
var dy=5;
var canvasWidth = 600;
var canvasHeight = 900;
var gravity = 0.5;
var damping = 0.5;
var traction = 0.8;
var borderReached;

//dirX and dirY are the initial speed
// acceleration is the speed difference between the balls
var circle1 = {color:'blue', radius:10, posX: 10, posY:20, dirX:5, dirY: 5, acceleration:0.1};
var circle2 = {color:'red', radius:20, posX: 100, posY:200, dirX:0, dirY: 0, acceleration:1.2};
var circle3 = {color:'pink', radius:15, posX: 10, posY:20, dirX:5, dirY: 5, acceleration:0.8};
var circle4 = {color:'orange', radius:30, posX: 100, posY:200, dirX:0, dirY: 0, acceleration:2.1};

function init() {
  canvas = document.getElementById("mycanvas");
	ctx = canvas.getContext("2d");
	computeFPS();
	canvas.height = canvasHeight;
	canvas.width = canvasWidth;
	setInterval(drawCircle, 25);
 	motion();
}




function drawCircle() {

	ctx.clearRect(0,0, canvasWidth,canvasHeight);

	//apply the animation to each circle object
	for (var i = 1; i <= 4; i++) {
		// access to the circle via a dynamic variable name creation
		currentCircle = window['circle' + i];

		if (document.getElementById('gravityX').innerHTML < 0 ||  document.getElementById('gravityX').innerHTML > 0 ) {
			//every ball has a different acceleration
			currentCircle.dirX = document.getElementById('gravityX').innerHTML * (1 + currentCircle.acceleration);
		}

		if (document.getElementById('gravityY').innerHTML < 0 ||  document.getElementById('gravityY').innerHTML > 0 ) {
			//every ball has a different acceleration
			// currentCircle.dirY = document.getElementById('gravityY').innerHTML * (1 + currentCircle.acceleration);
		}
		
	    
	    //check if the ball is hitting the right border
    	if ((currentCircle.posX + currentCircle.radius) > canvasWidth ) {
    		currentCircle.posX = canvasWidth - currentCircle.radius - 1 ;	
	    	// every time the ball hits the upper or lower border, the next "move" distance is getting lower
	    	currentCircle.dirX = -currentCircle.dirX * damping;

    	//check if the ball is hitting the left border
    	} else if (currentCircle.posX - currentCircle.radius <= 0) {
    		//add 3 to add some margin and avoid the ambiguous posX 0 situations
    		currentCircle.posX = currentCircle.radius + 3 ;
	    	// every time the ball hits the upper or lower border, the next "move" distance is getting lower
	    	currentCircle.dirX = -currentCircle.dirX * damping;
    	}
	    	


	    //check if the ball is hitting the upper or lower border
	    if ((currentCircle.posY + currentCircle.radius) > canvasHeight || (currentCircle.posY + currentCircle.radius) < 0) {
	    	// every time the ball hits the wall, the next "move" distance is getting lower
	    	currentCircle.dirY = -currentCircle.dirY * damping;

	    }


	    //if the next move is going to be under the border, don't apply the gravity
	    if(currentCircle.dirY >= (canvasHeight - currentCircle.posY - currentCircle.radius - gravity)) {
	    	//to correct the Y position when the ball in "under" the lower canvas border, we adjust it
	    	currentCircle.posY = canvasHeight - currentCircle.radius;

    	//check again if the circle in inside the canvas range
	    } else if( currentCircle.posY - currentCircle.radius < 0) {
    		currentCircle.posY =  currentCircle.radius;
	    	currentCircle.dirY = -currentCircle.dirY * damping;
    		currentCircle.dirY += gravity;
	    	
	    } else { //apply the gravity
			currentCircle.dirY += gravity;
	    }
	    
	    //apply the move the the current position
	    currentCircle.posX += currentCircle.dirX;
	    currentCircle.posY += currentCircle.dirY;
	    
		//generate the paths
		ctx.beginPath();
	  	
		ctx.fillStyle=currentCircle.color;
		
	    // Draws a circle of radius 20 at the coordinates x,y on the canvas
	    ctx.arc(currentCircle.posX,currentCircle.posY,currentCircle.radius,0,Math.PI*2,true);

	    ctx.closePath();
	    ctx.fill();

  	};

}


function motion() {

    if (!window.DeviceMotionEvent) {

     document.getElementById('gravityX').innerHTML = 'Error not compatible.';

 	} else {
	   //listen to the device movement
	    window.addEventListener('devicemotion', function(event) {
	    	document.getElementById('gravityX').innerHTML = Math.round(event.accelerationIncludingGravity.x);
	    	document.getElementById('gravityY').innerHTML = Math.round(event.accelerationIncludingGravity.y);
	    	//define the gravity and traction according to the movement
	    	gravity = - Math.round(event.accelerationIncludingGravity.y);
	    	traction = - Math.round(event.accelerationIncludingGravity.x);


    	});
    }
}


//check the number of frames between each second
var fps = {	startTime : 0,	frameNumber : 0,	
	getFPS : function(){	
	//add a frame	
	this.frameNumber++;
	//save the current time
	var d = new Date().getTime(), 
	currentTime = ( d - this.startTime ) / 1000,
	//compute the number of FPS
	result = Math.floor( ( this.frameNumber / currentTime ) );	
	if( currentTime > 1 ){
		this.startTime = new Date().getTime();
		this.frameNumber = 0;
		}
	return result;
	}
	};

function computeFPS(){
	setTimeout( computeFPS, 1000 / 60 );
	document.getElementById('fps').innerHTML = fps.getFPS();
}