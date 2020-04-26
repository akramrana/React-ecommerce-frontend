class LoginService{
	constructor(db) {
		this.db = db;
	}

	getUserData(){
		let promise = this.db.getOne('settings','userData');
		return promise.then((userinfo) => {
		   return userinfo?userinfo:{};
		});
	}
}
export default LoginService;