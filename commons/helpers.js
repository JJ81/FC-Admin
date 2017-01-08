var hbs = require('hbs');
var currencyFormatter = require('currency-formatter');
var dateFormat = require('dateformat');

hbs.registerHelper('isEquals', function (a, b) {
	return (a === b);
});

hbs.registerHelper('isEmpty', function (a) {
	return (a === '' || a === null);
});

//hbs.registerHelper('time', function (time) {
//	return moment().utc(time).format("YYYY-MM-DD HH:mm:ss");
//});

hbs.registerHelper('comma-number', function (num) {
	(num === null) ? num = 0 : null;
	return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
});

hbs.registerHelper('currency', function (num) {
	return currencyFormatter.format(num, { code: 'USD' });
});

hbs.registerHelper('checkMinus', function (num) {
	if(isNaN(num))
		num = parseInt(num);
	if(num.toString().indexOf('-') != -1)
		return true;
	return false;
});

hbs.registerHelper('time', function (date) {
	return dateFormat(date, "yyyy-mm-dd");
});

hbs.registerHelper('comparison', function(value , max){
  return (value < max) ? true: false;
});

hbs.registerHelper('for', function(from, to, incr, block) {
	var accum = '';
	for(var i = from; i < to; i += incr)
		accum += block.fn(i);
	return accum;
});

// course details (별평가에 따라서 어떤 클래스가 필요한지 리턴한다.)
hbs.registerHelper('star-rating', function(rating) {
	var _class = '';
	if(rating === 0 ){
		_class='empty';
	} else if(rating > 0 && rating < 1.4){
		_class='half';
	}else if(rating > 0 && rating <= 1.4){
		_class='one';
	}else if(rating >= 1.5 && rating < 2){
		_class='onehalf';
	}else if(rating >= 2 && rating < 2.5){
		_class='two';
	}else if(rating >= 2.5 && rating < 3){
		_class='twohalf';
	}else if(rating >= 3 && rating < 3.5){
		_class='three';
	}else if(rating >= 3.5 && rating < 4){
		_class='threehalf';
	}else if(rating >= 4 && rating < 4.5){
		_class='four';
	}else if(rating >= 4.5 && rating < 5){
		_class='fourhalf';
	}else{
		_class=''; // full
	}
	return _class;
});

hbs.registerHelper('percentage', function(num, total) {
	return Math.ceil((num/total)*100);
});

hbs.registerHelper('addOneForIndex', function(num) {
	return parseInt(num) + 1;
});
