$(function () {
	var username = RoleOperate.cookieName();
	if (!username) {
		window.location.href = '/QuickFrame/login-gs.html?appDomain=TrustManagement'
	}
})