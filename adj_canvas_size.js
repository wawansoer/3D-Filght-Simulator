const canvas = document.getElementById("main");
resizeWindow();
window.addEventListener("resize",resizeWindow);
function resizeWindow() {
	let screen_height = window.innerHeight;
	screen_height *= 0.9;
	let screen_width = window.innerWidth;
	screen_width *= 0.9;
	
	if ((screen_height/screen_width) > 0.75) {
		
    canvas.style.width = screen_width + "px";
    canvas.style.height = (screen_width * 0.75) + "px";
	}else{
		
    canvas.style.width = (screen_height * 1.3333) + "px";
    canvas.style.height = screen_height + "px";
	}
}