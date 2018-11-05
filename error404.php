<html>

<style type="text/css">

body {
	background-image: url("/media/scroll.png"), url("/media/osrs.png"), linear-gradient(black, black);
	background-repeat: no-repeat, no-repeat, repeat;
	background-attachment: fixed, fixed, fixed;
	background-position: 50% 260px, center top, 0px 0px;
	background-size: 240px 100px, auto, 100% 100%;
}

#gnomey {

	user-drag: none; 
user-select: none;
-moz-user-select: none;
-webkit-user-drag: none;
-webkit-user-select: none;
-ms-user-select: none;

}

</style>

<body>

<div align="center">

<h1> <font face="Comic Sans MS" font color = "white"> <font color="red"> Error 404: </font> Not found  </font> </h1>

<a href="/" draggable="false">
<img id="gnomey" src="/media/gnomeIcon.png" draggable="false" alt="Gnome">
</a>


<br><br>
<font face="Georgia" color="#0a2b6d"> <b><i> That's an oof, bröther. 
<br> There's no <span id="pathwayText"></span>!
</i></b> </font>

</div>

<iframe src="/media/oof.mp3" allow="autoplay" id="audio" style="display:none"></iframe>

</body>

</html>

<script>

document.getElementById("pathwayText").innerHTML = "" + window.location.pathname;

var gnome = document.getElementById('gnomey');
gnome.style.position = 'relative';
var radius = 60;
var speed = 3/4;
var gnomePos = radius;
var interval = setInterval(moveGnome, 10);

function moveGnome() {

	gnomePos += speed;
	if (gnomePos >= radius * 4) {
		gnomePos = 0;
	}
	
	var newPos = -radius;
	if(gnomePos <= radius*2){
		newPos += gnomePos;
	}
	else {
		newPos = radius*3 - gnomePos;
	}
	
	gnome.style.left = newPos + 'px';

}

</script>