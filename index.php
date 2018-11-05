<html>

<style type="text/css">

.unselectable {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

</style>

<body class="unselectable">

<div align="center">

<h1 id="greetingText"> Get Clicking </h1>

<?php

	$db = mysqli_connect("localhost:3306", "cootkri", "Giga2gigA", "elandone");
	if (!$db->connect_error) {
	
		echo("<i>Hey, bazinga!</i>");
		$table = "visitors";
		$ip = $_SERVER['REMOTE_ADDR'];
		$count = 1;
		
		$result = mysqli_query($db, "SELECT count FROM $table WHERE ip = '$ip'");
		if (mysqli_num_rows($result) == 0) {
			
			mysqli_query($db, "INSERT INTO $table (ip, count) VALUES ('$ip', '$count')");
			
		}
		else {
			
			$row = mysqli_fetch_row($result);
			$count += $row[0];
			mysqli_query($db, "UPDATE $table SET count = '$count' WHERE ip = '$ip'");
			
		}
		
		mysqli_close($db);
		
	}

?>

<img id="gnomey" src="media/gnomeIcon.png" draggable="false" alt="Gnome">

</div>

</body>

</html>

<script>

var greetings = [
	"Merry Chrysler",
	"Yeetmus",
	"B O D A C I O U S",
	"Buckle Up",
	"Eskettit",
	"Wack.",
	"I need a pharmacist",
	"Fareeha, my daughter",
	"Can of drink",
	"Back at it"
];

var gnome = document.getElementById("gnomey");
gnome.style.position = 'fixed';
var angle = 0;
var speed = 1/2;
var interval = setInterval(rotateGnome, 50);

function rotateGnome() {
	
	angle += speed;
	if (angle >= 360) {
		angle -= 360;
	}
	
	gnome.style.transform = "rotate(" + angle + "deg)";

}

document.addEventListener("click", onClick);

function onClick(event) {

	gnome.style.top = (event.clientY - gnome.clientHeight / 2) + 'px';
	gnome.style.left = (event.clientX - gnome.clientWidth / 2) + 'px';
	setRandomGreeting();

}

var greetingText = document.getElementById("greetingText");

function setRandomGreeting() {

	var line = greetings[Math.floor(Math.random()*greetings.length)];
	greetingText.textContent = line;

}

</script>