function setElems() {
	for (let p2 in game.prestige) {
		let p = game.prestige[p2];
		if (p.str_loc != joa([0])) {
			setElem('r' + JSON.stringify(p.loc), `
				你擁有 ${f(p.points)} ${getLayerName(p.loc)}點數和 ${f(p.power)} ${getLayerName(p.loc)}力量
			`);
			setElem('r2' + JSON.stringify(p.loc), `
				你擁有 ${f(p.points)} ${getLayerName(p.loc)}點數和 ${f(p.power)} ${getLayerName(p.loc)}力量
			`);
		} else {
			setElem('r' + JSON.stringify(p.loc), `
				你擁有 ${f(p.points)} 反物質
			`);
			setElem('r2' + JSON.stringify(p.loc), `
				你擁有 ${f(p.points)} 反物質
			`);
		}
		if (getPrestigeGain(p.points).gt(0) || getPrestigeGain2(p.points, game.max_layer[0] - p.loc[0]).gt(0)) {
			setdisp('pb' + JSON.stringify(p.loc), 'inline-block');
		} else if (p.points.lt(1.79e308)) {
			hide('pb' + JSON.stringify(p.loc));
		}
		if (game.state == 0 || p.str_loc == JSON.stringify(game.max_layer)) {
			setElem('pb' + JSON.stringify(p.loc), `
				聲望得到：${f(getPrestigeGain(p.points).mul(10))} ${getLayerName(p.next_loc)}點數
			`);
		} else if (game.state == 1){
			let diff = game.max_layer[0] - p.loc[0];
			setElem('pb' + JSON.stringify(p.loc), `
				聲望得到：${f(getPrestigeGain2(p.points, diff).mul(10))} ${getLayerName(game.max_layer)}點數
			`);
		}
		for (let g of p.dims) {
			if (p.str_loc != '[0]') {
				setElem('t' + JSON.stringify(g.loc) + JSON.stringify(g.id), `
					${getLayerName(g.loc).replace(/(^|[\s-])\S/g, function (match) {return match.toUpperCase()})}維度 ${f(g.dim.add(1))}<br>
					${f(g.amount)} x${f(g.mult)}<br>
					成本：${f(g.price)}
				`);
			} else {
				setElem('t' + JSON.stringify(g.loc) + JSON.stringify(g.id), `
				維度 ${f(g.dim.add(1))}<br>
				${f(g.amount)} x${f(g.mult)}<br>
				成本：${f(g.price)}
			`);
			}
		}
	}
	
	// Autosave Stuff
	if (game.as) {
		document.getElementById('as').className = document.getElementById('as').className.replace('red', 'green');
		game.asintv = JSON.parse(document.getElementById('asintv').value);
		show('asintvp');
	} else {
		document.getElementById('as').className = document.getElementById('as').className.replace('green', 'red');
		hide('asintvp');
	}
	
	game.notation = document.getElementById('notation').value;
	
	// Statistics
	
	setElem('stats', `
		你擁有 ${f(game.prestige[joa([0])].points)} 反物質<br>
		你最好的聲望層次是 ${JSON.stringify(game.max_layer) == joa([0]) ? '……噢，你還沒有聲望' : getLayerName(game.max_layer)}<br>
		你的遊玩時間是 ${game.disp_time}
	`);
	
	// Automation Unlock
	if (game.celerity_unlocked) {
		show('autodiv');
		hide('autolock');
		
		setdisp('autoauto', 'inline-block');
		if (game.max_layer[0].gte(199)) {
			show('autobulkdiv');
			hide('autobulklock');
			setElem('buybulkauto', '增加自動聲望級數：' + (game.bulk_level < 5 ? f(n(game.BULK_PRICES[game.bulk_level])) + '反物質' : 'N/A'));
			if (game.bulk_level >= 5) {
				document.getElementById('buybulkauto').className = document.getElementById('buybulkauto').className.replace('red', 'blue').replace('green', 'blue');
			} else {
				if (game.prestige[joa([0])].points.gte(game.BULK_PRICES[game.bulk_level])) {
					document.getElementById('buybulkauto').className = document.getElementById('buybulkauto').className.replace('red', 'green');
				} else {
					document.getElementById('buybulkauto').className = document.getElementById('buybulkauto').className.replace('green', 'red');
				}
			}
			for (let i = 0; i < 5; i++) {
				if (game.bulk_level > i) {
					document.getElementById('ll' + i).className = document.getElementById('ll' + i).className.replace('red', 'green');
				} else {
					document.getElementById('ll' + i).className = document.getElementById('ll' + i).className.replace('green', 'red');
				}
			}
		} else {
			hide('autobulkdiv');
			setdisp('autobulklock', 'inline-block');
		}
		
		show('mt4');
		hide('mt4alt');
	} else {
		hide('autodiv');
		hide('autobulkdiv');
		hide('autobulklock');
		hide('autoauto');
		setdisp('autolock', 'inline-block');
		
		hide('mt4');
		setdisp('mt4alt', 'inline-block');
	}
	
	if (game.autoauto) {
		document.getElementById('autoauto').className = document.getElementById('autoauto').className.replace('red', 'blue').replace('green', 'blue');
	} else {
		if (game.prestige[joa([0])].points.gt('eee100')) {
			document.getElementById('autoauto').className = document.getElementById('autoauto').className.replace('red', 'green');
		} else {
			document.getElementById('autoauto').className = document.getElementById('autoauto').className.replace('green', 'red');
		}
	}
	
	for (let p2 in game.prestige) {
		let p = game.prestige[p2];
		setElem('ama' + JSON.stringify(p.loc), `
			解鎖自動購買最大<br>
			成本：${f(auto_max_cost(p.loc))} ${JSON.stringify(p.loc) == '[0]' ? 'Antimatter' : getLayerName(p.loc).replace(/(^|[\s-])\S/g, function (match) {return match.toUpperCase()}) + '點數'}
		`);
		if (p.is_auto_max) {
			document.getElementById('ama' + JSON.stringify(p.loc)).className = document.getElementById('ama' + JSON.stringify(p.loc)).className.replace('red', 'blue').replace('green', 'blue');
		} else {
			if (afford_auto_max(p.loc)) {
				document.getElementById('ama' + JSON.stringify(p.loc)).className = document.getElementById('ama' + JSON.stringify(p.loc)).className.replace('red', 'green');
			} else {
				document.getElementById('ama' + JSON.stringify(p.loc)).className = document.getElementById('ama' + JSON.stringify(p.loc)).className.replace('green', 'red');
			}
		}
		
		setElem('autoauto', `自動化自動的購買：${f('eee100')}`);
		
		setElem('ap' + JSON.stringify(p.loc), `
			解鎖自動聲望獲得<br>
			成本：${f(auto_prestige_cost(p.loc))} ${JSON.stringify(p.loc) == '[0]' ? 'Antimatter' : getLayerName(p.loc).replace(/(^|[\s-])\S/g, function (match) {return match.toUpperCase()}) + '點數'}
		`);
		if (p.is_auto_prestige) {
			document.getElementById('ap' + JSON.stringify(p.loc)).className = document.getElementById('ap' + JSON.stringify(p.loc)).className.replace('red', 'blue').replace('green', 'blue');
		} else {
			if (afford_auto_prestige(p.loc)) {
				document.getElementById('ap' + JSON.stringify(p.loc)).className = document.getElementById('ap' + JSON.stringify(p.loc)).className.replace('red', 'green');
			} else {
				document.getElementById('ap' + JSON.stringify(p.loc)).className = document.getElementById('ap' + JSON.stringify(p.loc)).className.replace('green', 'red');
			}
		}
	}
}
