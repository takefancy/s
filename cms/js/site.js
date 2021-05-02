$(function() {
	var groupId = '1354574298222881';
	// var appId = '196385975607180';
	var appId = '2843914662526802'; //test
	window.fbAsyncInit = function() {
		FB.init({
			appId: appId,
			autoLogAppEvents: true,
			xfbml: true,
			version: 'v10.0'
		});
	};
	$('#btnFBBotAccessToken').click(function() {

		FB.login(function(e) {
			if (e.authResponse) {
				var accessToken = e.authResponse.accessToken;
				console.log(accessToken);
				//save accessToken
				// FB.api('/' + groupId + '/videos?fields=source', function(res) {
				//     var video = res.data[0];
				//     console.log(video.source);
				//     var player = videojs('player');
				//     player.src(video.source);
				//     player.play();
				//     player.ready(function() {
				//         player.play();
				//     });
				// });
			}
		}, {
			scope: 'publish_to_groups'
		});
	});
});