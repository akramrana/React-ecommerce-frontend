class CartService {

	constructor(db) {
		this.db = db;
	}

	getCartCount(){
		let promise = this.db.getOne('settings','cartData');
		return promise.then((cartinfo) => {
			let cartQty = 0;
			if (cartinfo && cartinfo.length) {
				cartinfo.forEach((entry,key)=>{
					cartQty+=parseInt(entry.qty)
				});
			}
			return cartQty;
		})
	}

	getCartItems(){
		let promise = this.db.getOne('settings','cartData');
		return promise.then((cartinfo) => {
			if (cartinfo && cartinfo.length) {
				return cartinfo;
			}else{
				return [];
			}
		})
	}

	getCartTotal(){
		let promise = this.db.getOne('settings','cartData');
		return promise.then((cartinfo) => {
			let cartTotal = 0;
			if (cartinfo && cartinfo.length) {
				cartinfo.forEach((entry,key)=>{
					cartTotal+=parseInt(entry.qty)*parseFloat(entry.final_price);
				});
			}
			return cartTotal.toFixed(3);
		})
	}

	getOrderId(){
		let promise = this.db.getOne('settings','orderId');
		return promise.then((cartOrderId) => {
			let orderId = "";
			if (cartOrderId && cartOrderId.length) {
				orderId = cartOrderId;
			}
			return orderId;
		})
	}

	removeProductFromCart(pid){
		let promise = this.db.getOne('settings','cartData');
		return promise.then((cartinfo) => {
			if (cartinfo && cartinfo.length) {
				let cartData = [];
				cartinfo.forEach((entry,key)=>{
					if(parseInt(entry.product_id)!=parseInt(pid)){ 
						let param = {
				    		product_id:entry.product_id,
				    		qty:entry.qty,
				    		image:entry.image,
				    		sku:entry.sku,
				    		name:entry.name,
				    		short_description:entry.short_description,
				    		final_price:entry.final_price,
				    		currency_code:entry.currency_code,
				    		remaining_quantity:entry.remaining_quantity
				       }
				       cartData.push(param);
					}
				})
				this.db.insert("settings",cartData,'cartData');
			}
		});
	}

	updateCartProductQty(pid,qty){
		let promise = this.db.getOne('settings','cartData');
		return promise.then((cartinfo) => {
			if (cartinfo && cartinfo.length) {
				let cartData = [];
				cartinfo.forEach((entry,key)=>{
					if(parseInt(entry.product_id)==parseInt(pid)){ 
						let param = {
				    		product_id:entry.product_id,
				    		qty:qty,
				    		image:entry.image,
				    		sku:entry.sku,
				    		name:entry.name,
				    		short_description:entry.short_description,
				    		final_price:entry.final_price,
				    		currency_code:entry.currency_code,
				    		remaining_quantity:entry.remaining_quantity
				       }
				       cartData.push(param);
					}else{
						let param = {
				    		product_id:entry.product_id,
				    		qty:entry.qty,
				    		image:entry.image,
				    		sku:entry.sku,
				    		name:entry.name,
				    		short_description:entry.short_description,
				    		final_price:entry.final_price,
				    		currency_code:entry.currency_code,
				    		remaining_quantity:entry.remaining_quantity
				       }
				       cartData.push(param);
					}
				})
				this.db.insert("settings",cartData,'cartData');
			}
		});
	}
}
export default CartService;