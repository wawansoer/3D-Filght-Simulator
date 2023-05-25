var key = {
	"up":false,
	"down":false,
	"left":false,
	"right":false,
	"space":false,
	"shift":false,
	"z":false,
	"x":false,
	"c":false,
  "w":false,
  "a":false,
  "s":false,
  "d":false,
  "q":false,
  "e":false,
  "i":false,
  "k":false,
  "j":false
};
var afnc = {
	"ArrowUp":"up",
	"ArrowDown":"down",
	"ArrowLeft":"left",
	"ArrowRight":"right",
	"Shift":"shift",
	"z":"z",
	"x":"x",
	"c":"c",
  "w":"w",
  "a":"a",
  "s":"s",
  "d":"d",
  "q":"q",
  "e":"e",
  "i":"i",
  "k":"k",
  "j":"j"
}

//Key input determination program in if statement for folding
if (true) {
	window.addEventListener('keydown', event => {
		if (event.key === " ") {
			key.space = true;
		}else if (event.key !== "undefined") {
			key[afnc[event.key]] = true;
		}
	});

	window.addEventListener('keyup', event => {
		if (event.key === " ") {
			key.space = false;
		}else if (event.key !== "undefined") {
			key[afnc[event.key]] = false;
		}
	});
}