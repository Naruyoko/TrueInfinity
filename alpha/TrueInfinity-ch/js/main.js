// Chuck your data into the depths of the localStorage variable...
function save() {
	localStorage.setItem('infchsave', btoa(JSON.stringify(game)));
	if (game.as) {
		setTimeout(save, game.asintv * 1000);
	}
}

// Clear the save file
function wipe(nc) {
	if (!nc) {
		if (confirm('你想不想要重置全部進度？！？')) {
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
	if (localStorage.getItem('infchsave') != undefined && localStorage.getItem('infchsave') != 'undefined' && localStorage.getItem('infchsave') != null) {
		clearAll();
		try {
			game = new Game(JSON.parse(atob(localStorage.getItem('infchsave'))));
		} catch(e) {
			console.warn('Outdated save, updating');
			game = new Game(JSON.parse(localStorage.getItem('infchsave')));
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
		alert('存檔成功複製到剪貼簿');
	} catch(e) {
		console.warn(e);
		alert('存檔失敗複製到剪貼簿');
	}
}

// Import a save file
function imp() {
	let b64 = prompt('請輸入存檔：');
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
		if (confirm('你確不確定？這樣會複寫你現在的進度！')) {
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
