// Chuck your data into the depths of the localStorage variable...
function save() {
	localStorage.setItem('save', btoa(JSON.stringify(game)));
	if (game.as) {
		setTimeout(save, game.asintv * 1000);
	}
}

// Clear the save file
function wipe(nc) {
	if (!nc) {
		if (confirm('Do you want to delete ALL of your progress?!?')) {
			clearAll();
			game = new Game();
			firstTime();
			save();
		}
	} else {
		clearAll();
		game = new Game();
		firstTime();
		save();
	}
}

// Retrieve your data from the depths of the localStorage variable...
function load() {
	if (localStorage.getItem('save') != undefined && localStorage.getItem('save') != 'undefined' && localStorage.getItem('save') != null) {
		clearAll();
		try {
			game = new Game(JSON.parse(atob(localStorage.getItem('save'))));
		} catch(e) {
			console.warn('Outdated save, updating');
			game = new Game(JSON.parse(localStorage.getItem('save')));
		}
		save();
		return true;
	} else {
		return false;
	}
}

// Export a save file
function exp() {
	// prompt('Exported Save: ', btoa(JSON.stringify(game)));
	let output = document.getElementById('expout');
	let parent = output.parentElement;
	parent.style.display = "";
	output.value = btoa(JSON.stringify(game));
	output.onblur = function() {
		parent.style.display = "none";
	}
	output.focus();
	output.select();
	try {
		document.execCommand('copy');
		output.blur();
		alert('Save copied to clipboard');
	} catch(e) {
		console.warn(e);
		alert('Failed to copy to clipboard');
	}
}

// Import a save file
function imp() {
	let b64 = prompt('Enter a save file: ');
	let c = true;
	if (b64 == null) {
		c = false;
	}
	let json;
	try {
		json = atob(b64);
	} catch(e) {
		c = false;
		alert(e);
	}
	if (c) {
		if (confirm('Are you sure? This will override your current progress!')) {
			clearAll();
			game = new Game(JSON.parse(json));
			save();
			return true;
		} else {
			return false;
		}
	}
}

let game;
let fpsOut;
let filterStrength = 20;
let frameTime = 0, lastLoop = new Date, thisLoop;

function init() {
	fpsOut = document.getElementById('fps');
	
	if (!load()) {
		wipe(true);
	}
	
	document.getElementById('asintv').value = game.asintv;
	document.getElementById('notation').value = game.notation;
	setInterval(loop, 50);
}

function firstTime() {
	game.prestige[joa([0])] = new Layer(oa([0]), 100);
}

function loop() {
	game.update();
	setElems();
	updatePrestiges();
	auto();
	fps();
}

function fps() {
	var thisFrameTime = (thisLoop = new Date) - lastLoop;
	frameTime += (thisFrameTime - frameTime) / filterStrength;
	lastLoop = thisLoop;
	fpsOut.innerHTML = (1000 / frameTime).toFixed(0);
}