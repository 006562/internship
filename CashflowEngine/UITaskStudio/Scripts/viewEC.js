define('viewECWork',{
	render:function(){
		var ecwork = Vue.extend({
			template : '#ecWorkTemplate'
		})
		Vue.component('ec-work',ecwork);
	}
});