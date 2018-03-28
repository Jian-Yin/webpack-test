require('../css/index.scss');

var $ = require('jquery'),
	dropdown = require('../modules/dropdown/dropdown'),
	dropdownData = require('../data/dropdown.json');

dropdown('.events-dropdown', {
	dropElemDefaultText: 'SORT BY',
	showElemData: dropdownData,
	showElemClickCallBack: function(s, o){
	},
	showCallBack: function(o){
	},
	hideCallBack: function(o){
	}
});