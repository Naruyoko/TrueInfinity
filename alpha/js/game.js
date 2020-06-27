class Game {
	constructor(data) {
		this.prestige = {};
		
		if (data) {
			if (data.prestige) {
				for (let i in data.prestige) {
					this.prestige[i] = l(data.prestige[i]);
				}
			}
		}
			
		this.starttime = data ? (new Date(data.starttime) || new Date()) : new Date();	
		this.asintv = data ? (JSON.parse(data.asintv) || 10) : 10;
		this.as = JSON.parse(data ? (JSON.stringify(data.as) || true) : true);
		
		this.notation = data ? (data.notation || 'sci') : 'sci';
		
		this.max_layer = data ? (oa(data.max_layer) || oa([0])) : oa([0]);	
		this.state = 0;
		
		this.automaxall = data ? (data.automaxall.map(e => oa(e)) || []) : [];
		this.autoprestige = data ? (data.autoprestige.map(e => oa(e)) || []) : [];
		this.autoauto = data ? (data.autoauto || false) : false;
		
		this.bulk_level = data ? (data.bulk_level || 0) : 0;
		this.BULK_PRICES = ['eee500', 'eee3000', 'eee8000', 'eee50000', 'eeee10', 'Infinity'];
		this.bulk_cooldown = 0;
	}
	
	update() {
		for (let i in this.prestige) {
			this.prestige[i].update();
			if (!this.prestige[i].initiated) {
				this.prestige[i].init();
			}
		}
		if (cmpLayer(this.max_layer, oa([7])) >= 0) {
			if (Object.keys(this.prestige).length >= 2) {
				for (let i in this.prestige) {
					let j = this.prestige[i];
					if (j.str_loc != joa([0]) && cmpLayer(this.max_layer, j.loc) == 1) {
						delete this.prestige[i];
					}
				}
			}
			this.state = 1;
		} else {
			this.state = 0;
		}
		for (let i of this.automaxall) {
			let str_loc = JSON.stringify(i);
			if (!game.prestige[str_loc]) {
				this.automaxall.splice(this.automaxall.indexOf(i), 1);
			}
		}
		for (let i of this.autoprestige) {
			let str_loc = JSON.stringify(i);
			if (!game.prestige[str_loc]) {
				this.autoprestige.splice(this.autoprestige.indexOf(i), 1);
			}
		}
	}
	
	get disp_time() {
		let time = new Date() - this.starttime;
		if (time < 60000) {
			return (Math.floor(time / 1000)).toString() + ' seconds';
		} else if (time < 3600000) {
			return (Math.floor(time / 60000)).toString() + ' minutes';
		} else if (time < 86400000) {
			return (Math.floor(time / 3600000)).toString() + ' hours';
		} else if (time < 604800000) {
			return (Math.floor(time / 86400000)).toString() + ' days';
		} else if (time < 2592000000) {
			return (Math.floor(time / 604800000)).toString() + ' weeks';
		} else if (time < 31536000000) {
			return (Math.floor(time / 2592000000)).toString() + ' months';
		} else {
			return (Math.floor(time / 31536000000)).toString() + ' years';
		}
	}
	
	get celerity_unlocked() {
		return cmpLayer(this.max_layer, [6]) >= 0;
	}
}

class Layer {
	constructor(loc, points, power, dims, tslp, auto) {
		this.loc = oa(loc || [0]);
		this.str_loc = JSON.stringify(this.loc);
		
		this.points = n(points || 0);
		this.power = n(power || 0);
		
		this.dims = dims ? dims.map(x => d(x)) : [new Dimension(0, loc)];
		
		this.tslp = tslp || 0;
		this.initiated = false;
		this.mult = n(1);
		
		this.maxAllCooldown = 0;
		
		this.is_auto_max = auto ? (auto[0] || false) : false;
		this.is_auto_prestige = auto ? (auto[1] || false) : false;
	}
	
	init() {
		this.initiated = true;
		createLayer(this.loc);
	}
	
	get next_loc() {
		let next_loc = oa(this.loc);
		next_loc[0] = next_loc[0].add(1)
		return next_loc;
	}
	
	incPoints(n) {
		this.points = OmegaNum.add(n, this.points);
	}
	
	incPower(n) {
		this.power = OmegaNum.add(n, this.power);
	}
	
	subPoints(n) {
		this.points = OmegaNum.sub(this.points, n);
	}
	
	update() {
		this.mult = getMult(this.loc);
		
		if (this.points.gt('ee6')) {
			this.mult = this.mult.pow(1e6);
		}
		
		this.generate();
		
		this.maxAllCooldown > 0 ? this.maxAllCooldown-- : null;
		
		if (this.dims[this.dims.length - 1].amount.gt(0)) {
			this.dims.push(new Dimension(this.dims[this.dims.length - 1].dim.add(1), this.loc));
		}
		
		if (this.dims[this.dims.length - 1].dim.gte(10) && this.dims.length > 3) {
			if (document.getElementById('g' + this.str_loc + this.dims[1].id) != null) {
				removeElem('g' + this.str_loc + this.dims[1].id);
			}
			this.dims.splice(1, 1);
		}
		
		for (let i = 0; i < this.dims.length; i++) {
			if (document.getElementById('b' + this.str_loc + JSON.stringify(this.dims[i].id))) {
				document.getElementById('b' + this.str_loc + JSON.stringify(this.dims[i].id)).onclick = () => game.prestige[this.str_loc].dims[i].buy();
				document.getElementById('b2' + this.str_loc + JSON.stringify(this.dims[i].id)).onclick = () => game.prestige[this.str_loc].dims[i].buyMax();
			}
		}
		
		this.tslp++;
	}
	
	generate() {
		if (this.dims[this.dims.length - 1].dim.gte(10)) {
			this.dims[0].amount = this.dims[0].amount.add(secretFormula(this.tslp, this.dims[1].dim, this.dims[1].amount, this.dims[1].mult));
			let p = this.dims[0].mult.mul(this.dims[0].amount).div(20);
			this.str_loc == joa([0]) ? this.incPoints(p) : this.incPower(p);
		} else {
			for (let d of this.dims) {
				let p;
				if (game.state == 0 || this.dims[this.dims.length - 1].dim.lt(10)) {
					p = d.mult.mul(d.amount).div(20);
				} else {
					p = d.mult;
				}
				let dm = d.dim;
				if (dm.eq(0)) {
					this.str_loc == joa([0]) ? this.incPoints(p) : this.incPower(p);
				} else {
					this.dims[d.index - 1].amount = OmegaNum.add(p, this.dims[d.index - 1].amount);
				}
			}
		}
	}
	
	maxAll() {
		if (this.maxAllCooldown == 0) {
			if (this.dims.length >= 3 && this.dims[this.dims.length - 1].dim.gte(10)) {
				let x = this.dims[2].dim;
				let val = x.pow(1.1);
				if (this.dims[1].dim.gt(15) && new Dimension(val, this.loc, 0, 0).afford) {
					this.dims.push(new Dimension(val, this.loc, 1, 1));
				} else {
					let val = x.mul(1.1);
					if (this.dims[1].dim.gt(15) && new Dimension(val, this.loc, 0, 0).afford) {
						this.dims.push(new Dimension(val, this.loc, 1, 1));
					} else {
						let val = x.add(1000);
						if (this.dims[1].dim.gt(15) && new Dimension(val, this.loc, 0, 0).afford) {
							this.dims.push(new Dimension(val, this.loc, 1, 1));
						} else {
							let val = x.add(100);
							if (this.dims[1].dim.gt(15) && new Dimension(val, this.loc, 0, 0).afford) {
								this.dims.push(new Dimension(val, this.loc, 1, 1));
							} else {
								let val = x.add(10);
								if (this.dims[1].dim.gt(15) && new Dimension(val, this.loc, 0, 0).afford) {
									this.dims.push(new Dimension(val, this.loc, 1, 1));
								} else {
									for (let d of this.dims) {
									d.buy();
									d.buyMax();
									}
								}
							}
						}
					}
				}
			} else {
				for (let d of this.dims) {
					d.buy();
					d.buyMax();
				}
			}
			this.maxAllCooldown = 3;
		}
	}
	
	clear() {
		if (this.str_loc == joa([0])) {
			this.points = n(10);
		} else {
			this.points = n(0);
		}
		this.power = n(0);
		this.tslp = 0;
		this.dims = [new Dimension(0, this.loc)];
	}
}

class Dimension {
	constructor(dim, loc, amount, bought) {
		this.dim = n(dim || 0).floor();
		
		this.loc = oa(loc || [0]);
		this.str_loc = joa(loc || [0]);
		
		this.amount = n(amount || 0).floor();
		this.bought = n(bought || 0).floor();
		
		this.price_start = OmegaNum.pow(10, this.dim.add(1));
		
		this.id = Math.floor(Math.random() * 10000000000);
	}
	
	get mult() {
		if (game.prestige[this.str_loc]) {
			return OmegaNum.pow(2, this.bought).mul(game.prestige[this.str_loc].mult);
		} else {
			return n(1);
		}
	}
	
	get index() {
		return game.prestige[this.str_loc].dims.indexOf(this);
	}
	
	get price() {
		if (game.state == 0) {
			return OmegaNum.pow(this.dim.floor().lt(100) ? 10 : this.dim.mul(0.9).floor(), this.dim.add(1).mul(this.bought.add(1)));
		} else {
			return OmegaNum.pow(10, this.dim.add(1).mul(this.bought.add(1)));
		}
	}
	
	get afford() {
		return game.prestige[this.str_loc].points.gte(this.price);
	}
	
	get next_str_loc() {
		let x = oa(JSON.parse(this.str_loc)[0]);
		x[0] = x[0].add(1);
		return JSON.stringify(x);
	}
	
	buy() {
		if (this.afford) {
			let pc = this.price;
			this.amount = this.amount.add(1);
			this.bought = this.bought.add(1);
			
			game.prestige[this.str_loc].subPoints(pc);
			
			return true;
		} else {
			return false;
		}
	}
	
	get max_afford() {
		if (this.dim.gt(100)) {
			return new OmegaNum(1);
		}
		if (game.prestige[this.str_loc].points.isint() && this.price_start.isint() && OmegaNum.pow(this.dim.lt(100) ? 10 : this.dim, this.dim.add(1)).isint() && this.bought.isint()){
			return OmegaNum.affordGeometricSeries(game.prestige[this.str_loc].points, this.price_start, OmegaNum.pow(this.dim.lt(100) ? 10 : this.dim, this.dim.add(1)), this.bought);
		}
	}
	
	get max_price() {
		return OmegaNum.sumGeometricSeries(this.max_afford, this.price_start, OmegaNum.pow(this.dim.lt(100) ? 10 : this.dim, this.dim.add(1)), this.bought);
	}
	
	buyMax() {
		if (this.afford) {
			let ma = this.max_afford;
			let mp = this.max_price;
			
			if (ma.lt(1e6)) {
				this.amount = this.amount.add(ma);
				this.bought = this.bought.add(ma);
				
				game.prestige[this.str_loc].subPoints(mp);
				
				return true;
			}
		}
		return false;
	}
}