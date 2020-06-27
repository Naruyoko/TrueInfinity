function createLayer(loc) {
	let p = createDiv('layerswrapper', 'p' + JSON.stringify(loc), 'p');
	let r = createResBox(loc);
	let m = createElem('p' + JSON.stringify(loc), 'm' + JSON.stringify(loc), 'button', 'maxall sbb green');
	m.innerHTML = '全部最大';
	m.onclick = () => {maxAll(loc)};
	let br = createElem('p' + JSON.stringify(loc), '', 'br');
	let pb = createElem('p' + JSON.stringify(loc), 'pb' + JSON.stringify(loc), 'button', 'pb sbb blue');
	pb.innerHTML = 'Prestige for: ';
	pb.onclick = () => {prestige(loc)};
	
	let auto = createDiv('autodiv', 'auto' + JSON.stringify(loc), 'auto');
	let r2 = createDiv('auto' + JSON.stringify(loc), 'r2' + JSON.stringify(loc), 'r');
	let ama = createElem('auto' + JSON.stringify(loc), 'ama' + JSON.stringify(loc), 'button', 'ama sbb green');
	ama.onclick = () => {buy_auto_max(loc)};
	let br2 = createElem('auto' + JSON.stringify(loc), '', 'br');
	let ap = createElem('auto' + JSON.stringify(loc), 'ap' + JSON.stringify(loc), 'button', 'ap sbb green');
	ap.onclick = () => {buy_auto_prestige(loc)};
	let br3 = createElem('auto' + JSON.stringify(loc), '', 'br');
	let para = createElem('auto' + JSON.stringify(loc), '', 'p', '');
}

function createResBox(loc) {
	let r = createDiv('p' + JSON.stringify(loc), 'r' + JSON.stringify(loc), 'r');
	return r;
}

function createGenerator(dim, loc, index) {
	let d = n(dim);
	let o = game.prestige[JSON.stringify(loc)].dims[index];
	
	let g = createDiv('p' + JSON.stringify(loc), 'g' + JSON.stringify(loc) + JSON.stringify(o.id), 'g');
	
	let t = createElem('g' + JSON.stringify(loc) + JSON.stringify(o.id), 't' + JSON.stringify(loc) + JSON.stringify(o.id), 'p', 'gt');
	
	let b = createElem('g' + JSON.stringify(loc) + JSON.stringify(o.id), 'b' + JSON.stringify(loc) + JSON.stringify(o.id), 'button', 'gb sbb green height half');
	b.innerHTML = '購買';
	let b2 = createElem('g' + JSON.stringify(loc) + JSON.stringify(o.id), 'b2' + JSON.stringify(loc) + JSON.stringify(o.id), 'button', 'gb sbb green height half');
	b2.innerHTML = '購買最大';
	hide(b.id);
	hide(b2.id);
	
	let h = createElem('g' + JSON.stringify(loc) + JSON.stringify(o.id), 'h' + JSON.stringify(loc) + JSON.stringify(o.id), 'hr');
	
	setTimeout(function() {
		if (document.getElementById('b' + JSON.stringify(loc) + JSON.stringify(o.id))) setdisp('b' + JSON.stringify(loc) + JSON.stringify(o.id), 'inline-block');
		if (document.getElementById('b2' + JSON.stringify(loc) + JSON.stringify(o.id))) setdisp('b2' + JSON.stringify(loc) + JSON.stringify(o.id), 'inline-block');
	}, 50);
	
	return g;
}

function updatePrestiges() {
	let ps = document.querySelectorAll('.p');
	for (let i = 0; i < ps.length; i++) {
		let p = ps[i]
		let id = p.id;
		let loc = id.replace('p', '');
		let rloc = JSON.parse(loc);
		if (typeof game.prestige[loc] == 'undefined') {
			removeElem(id);
			removeElem(id.replace('p', 'auto'));
		}
	}
	for (let i in game.prestige) {
		let loc = JSON.stringify(game.prestige[i].loc);
		let rloc = oa(game.prestige[i].loc);
		if (document.getElementById('p' + loc) == null) {
			createLayer(rloc);
		}
		for (let j of game.prestige[i].dims) {
			let dim = j.id
			if (document.getElementById('g' + loc + dim) == null) {
				createGenerator(dim, rloc, game.prestige[i].dims.indexOf(j));
			}
			if (j.afford) {
				document.getElementById('b' + loc + dim).className = document.getElementById('b' + loc + dim).className.replace('red', 'green');
				document.getElementById('b2' + loc + dim).className = document.getElementById('b2' + loc + dim).className.replace('red', 'green');
			} else { 
				document.getElementById('b' + loc + dim).className = document.getElementById('b' + loc + dim).className.replace('green', 'red');
				document.getElementById('b2' + loc + dim).className = document.getElementById('b2' + loc + dim).className.replace('green', 'red');
			}
		}
		let p = document.getElementById('p' + loc);
		let gens = p.getElementsByClassName('g');
		for (let j = 0; j < gens.length; j++) {
			let n = gens[j];
			let id = n.id;
			let dim = id.replace('g', '').replace(loc, '');
			let del = true;
			for (let k of game.prestige[i].dims) {
				if (JSON.stringify(k.id) == dim) {
					del = false;
					break;
				}
			}
			if (del) {
				removeElem(id);
			}
		}
	}
}

function clearAll() {
	let node = document.querySelector('#layerswrapper');
	while (node.hasChildNodes()) {
		node.removeChild(node.lastChild);
	}
	node = document.querySelector('#autodiv');
	while (node.hasChildNodes()) {
		node.removeChild(node.lastChild);
	}
}
