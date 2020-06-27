function f(num) {
	return N[game.notation](num);
}

let N = {};

// Credit Omsi6
N.PREFIXES = {};
N.PREFIXES.PRIMARY = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No'];
N.PREFIXES.PRIMARY_ALTERNATE = ['', 'U', 'D', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No'];
N.PREFIXES.SECONDARY = ['', 'Dc', 'Vg', 'Tg', 'Qd', 'Qn', 'Se', 'St', 'Og', 'Nn'];
N.PREFIXES.TERTIARY = ['', 'Ce', 'Dn', 'Tc', 'Qe', 'Qu', 'Sc', 'Si', 'Oe', 'Ne'];

/*
	Notations:
		N.sci - Scientific Notation
		N.eng - Engineering Notation
		N.log - Logarithm Notation
		N.stn - Standard Notation
		N.uar - Up Arrow Notation
		N.chn - Chain Arrow Notation
		N.ban - Bird's Array Notation
		N.hyp - Hyper E Notation
		N.inf - Infinity Notation
		N.tin - True Infinity Notation
*/

N.sci = function(num) {
	let x = new OmegaNum(num).floor();
	let a = x.array;
	let l = a.length;
	
	if (l == 1) {
		if (x.lt(1e6)) {
			return x.toString();
		} else {
			return x.toNumber().toExponential(0).toString().replace(/\+/, '');
		}
	} else if (l == 2 && a[1] < 14) {
		if (x.log10().lt(1e6)) {
			return Math.pow(10, a[0] % 1).toFixed(0).toString() + 'e' + x.log10().floor().toString()
		} else {
			return 'e' + N.sci(x.log10().floor());
		}	
	} else {
		return num.toString();
	}
}

N.eng = function(num) {
	let x = new OmegaNum(num).floor();
	let a = x.array;
	let l = a.length;
	if (x.eq(0)) {
		return '0';
	}
	let mod3e = x.log10().floor().mod(3);
		
	if (l == 1) {
		if (x.lt(1e6)) {
			return x.toString();
		} else {
			let exponent = x.log10().floor().sub(mod3e);
			let mantissa = x.div(OmegaNum.pow(10, exponent)).floor();
			return mantissa.toString() + 'e' + exponent.toString();
		}
	} else if (l == 2 && a[1] < 14) {
		if (x.log10().lt(1e6)) {
			return (Math.pow(10, a[0] % 1) * OmegaNum.pow(10, mod3e).toNumber()).toFixed(0).toString() + 'e' + x.log10().floor().sub(mod3e).toString();
		} else {
			return 'e' + N.eng(x.log10().floor());
		}
	} else {
		return num.toString();
	}
}

N.log = function(num) {
	let x = new OmegaNum(num).floor();
	if (x.gt(1e6)) {
		let flr = x.log10().mul(100).floor().div(100);
		if (flr.lt(1e6)) {
			return 'e' + flr.toString();
		} else {
			return 'e' + N.log(flr);
		}
	} else {
		return x.toString();
	}
}

N.stn = function(num) {
	let x = new OmegaNum(num).floor();
	let a = x.array;
	let l = a.length;
	if (x.eq(0)) {
		return '0';
	}
	let mod3e = x.log10().floor().mod(3);
		
	let prf = '';
	if (x.lt(1e33)) {
		let n = x.logBase(1e3).floor().mod(11).toNumber();
		prf = N.PREFIXES.PRIMARY[n]
	} else if (x.lt('e3003')) {
		let n = x.div(1000).logBase(1e3).floor().mod(10).toNumber();
		let pt1 = N.PREFIXES.PRIMARY_ALTERNATE[n];
		let pt2 = N.PREFIXES.SECONDARY[x.div(1000).logBase(1e30).floor().mod(10).toNumber()];
		let pt3 = N.PREFIXES.TERTIARY[x.div(1000).logBase(1e300).floor().mod(10).toNumber()];
		prf = pt1 + pt2 + pt3;
	} else {
		prf = '';
	}
	
	if (l == 1) {
		if (x.lt(1e3)) {
			return x.toString();
		} else {
			let exponent = x.log10().floor().sub(mod3e);
			let mantissa = x.div(OmegaNum.pow(10, exponent)).floor();
			return (Math.pow(10, a[0] % 1) * OmegaNum.pow(10, mod3e).toNumber()).toFixed(0).toString() + prf;
		}
	} else if (x.log10().lt(3003)) {
		return (Math.pow(10, a[0] % 1) * OmegaNum.pow(10, mod3e).toNumber()).toFixed(0).toString() + prf;
	} else {
		return N.eng(num);
	}
}

N.msc = function(num) {
	let x = new OmegaNum(num);
	if (x.lt(1e15)) {
		return N.stn(x);
	} else {
		return N.sci(x);
	}
}

N.men = function(num) {
	let x = new OmegaNum(num);
	if (x.lt(1e15)) {
		return N.stn(x);
	} else {
		return N.eng(x);
	}
}

N.mlg = function(num) {
	let x = new OmegaNum(num);
	if (x.lt(1e15)) {
		return N.stn(x);
	} else {
		return N.log(x);
	}
}

N.uar = function(num) {
	let x = new OmegaNum(num).floor();
	let a = x.array;
	let l = a.length;
	
	if (l == 1) {
		if (x.lt(1e6)) {
			return x.toString();
		} else {
			let exponent = x.log10().floor();
			let mantissa = x.div(OmegaNum.pow(10, exponent)).floor();
			return (mantissa.toString() == '1' ? '' : (mantissa.toString() + '&times;')) + '10&uarr;' + exponent.toString();
		}
	} else if (l == 2) {
		if (x.log10().lt(1e6)) {
			let exponent = x.log10().floor();
			let mantissa = x.div(OmegaNum.pow(10, exponent)).floor();
			return (mantissa.toString() == '1' ? '' : (mantissa.toString() + '&times;')) + '10&uarr;' + exponent.toString();
		} else {
			if (a[1] < 4) {
				if (N.uar(x.log10().floor()).search('&times;') != -1) {
					return '10&uarr;' + N.uar(x.log10().floor()).replace(/^\d/, '').replace('&times;', '');
				}
				return '10&uarr;' + N.uar(x.log10().floor());
			} else {
				if (((a[1] + 1) < 1e6 ? (a[1] + 1).toString() : N.uar(a[1] + 1)).search('&times;') != -1) {
					return '10&uarr;&uarr;' + ((a[1] + 1) < 1e6 ? (a[1] + 1) : N.uar(a[1] + 1)).replace(/^\d/, '').replace('&times;', '');
				}
				return '10&uarr;&uarr;' + ((a[1] + 1) < 1e6 ? (a[1] + 1) : N.uar(a[1] + 1));
			}
		}
	} else {
		return num.toString();
	}
}

N.chn = function(num) {
	let x = new OmegaNum(num).floor();
	let a = x.array;
	let l = a.length;
	
	if (l == 1) {
		if (x.lt(1e6)) {
			return x.toString();
		} else {
			let exponent = x.log10().floor();
			let mantissa = x.div(OmegaNum.pow(10, exponent)).floor();
			return (mantissa.toString() == '1' ? '' : mantissa.toString() + '&times;') + '10&rarr;' + exponent.toString() + '';
		}
	} else if (l == 2) {
		if (x.log10().lt(1e6)) {
			let exponent = x.log10().floor();
			let mantissa = x.div(OmegaNum.pow(10, exponent)).floor();
			return (mantissa.toString() == '1' ? '' : mantissa.toString() + '&times;') + '10&rarr;' + exponent.toString() + '';
		} else {
			if (a[1] < 4) {
				if (N.chn(x.log10().floor()).search('&times;') != -1) {
					return '10&rarr;(' + N.chn(x.log10().floor()).replace(/^\d/, '').replace('&times;', '') + ')';
				}
				return '10&rarr;(' + N.chn(x.log10().floor()) + ')';
			} else {
				if (N.chn(a[1] + 1).search('&times;') != -1) {
					return '10&rarr;' + ((a[1] + 1) < 1e6 ? (a[1] + 1) : ('(' + N.chn(a[1] + 1).replace(/^\d/, '').replace('&times;', '') + ')')) + '&rarr;2';
				}
				return '10&rarr;' + ((a[1] + 1) < 1e6 ? (a[1] + 1) : ('(' + N.chn(a[1] + 1) + ')')) + '&rarr;2';
			}
		}
	} else {
		return num.toString();
	}
}

N.ban = function(num) {
	let x = new OmegaNum(num).floor();
	let a = x.array;
	let l = a.length;
	
	if (l == 1) {
		if (x.lt(1e6)) {
			return x.toString();
		} else {
			let exponent = x.log10().floor();
			let mantissa = x.div(OmegaNum.pow(10, exponent)).floor();
			return (mantissa.toString() == '1' ? '' : mantissa.toString() + '&times;') + '{10, ' + exponent.toString() + '}';
		}
	} else if (l == 2) {
		if (x.log10().lt(1e6)) {
			let exponent = x.log10().floor();
			let mantissa = x.div(OmegaNum.pow(10, exponent)).floor();
			return (mantissa.toString() == '1' ? '' : mantissa.toString() + '&times;') + '{10, ' + exponent.toString() + '}';
		} else {
			if (a[1] < 4) {
				return '{10, ' + N.ban(x.log10().floor()).replace(/^\d/, '').replace('&times;', '') + '}';
			} else {
				return '{10, ' + ((a[1] + 1) < 1e6 ? (a[1] + 1) : N.ban(a[1] + 1)) + ', 2}';
			}
		}
	} else {
		return num.toString();
	}
}

N.hyp = function(num) {
	let x = new OmegaNum(num).floor();
	let a = x.array;
	let l = a.length;
	
	if (l == 1) {
		if (x.lt(1e6)) {
			return x.toString();
		} else {
			let exponent = x.log10().floor();
			let mantissa = x.div(OmegaNum.pow(10, exponent)).floor();
			return (mantissa.toString() == '1' ? '' : mantissa.toString()) + 'E' + exponent.toString();
		}
	} else if (l == 2) {
		if (x.log10().lt(1e6)) {
			let exponent = x.log10().floor();
			let mantissa = x.div(OmegaNum.pow(10, exponent)).floor();
			return (mantissa.toString() == '1' ? '' : mantissa.toString()) + 'E' + exponent.toString();
		} else {
			if (a[0] < 1e6) {
				return 'E' + Math.floor(a[0]) + '#' + (a[1]);
			} else {
				return 'E' + Math.floor(Math.log10(a[0])) + '#' + ((a[1] + 1) < 1e6 ? (a[1] + 1) : '(' + N.hyp(a[1] + 1) + ')');
			}
		}
	} else {
		return num.toString();
	}
}

N.inf = function(num) {
	let x = new OmegaNum(num).floor();
	if (x.gt(1e6)) {
		let flr = x.logBase(1.79e308).mul(1000).floor().div(1000);
		if (flr.lt(1e6)) {
			return flr.toNumber().toFixed(3) + '&infin;';
		} else {
			return N.inf(flr) + '&infin;';
		}
	} else {
		return N.sci(x);;
	}
}

N.tin = function(num) {
	let x = new OmegaNum(num).floor();
	if (x.gt('ee310')) {
		let flr = x.logBase(1.79e308).logBase(1.79e308).mul(1000).floor().div(1000);
		if (flr.lt('ee311')) {
			return N.inf(flr) + '&Omega;';
		} else {
			return N.tin(flr) + '&Omega;';
		}
	} else {
		return N.inf(x);
	}
}