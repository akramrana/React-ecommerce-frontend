class CommonService{
	constructor(db) {
		this.db = db;
	}

	getAllCategories(){
		let promise = this.db.getOne('settings','allCategories');
		return promise.then((categories) => {
		   return categories?categories:[];
		});
	}
}
export default CommonService;