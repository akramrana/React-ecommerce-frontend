import React from 'react';
import Web from '../config/Web'
import DB from '../helpers/DB';
import CommonService from '../services/CommonService';
import { Link } from "react-router-dom";

class CategoryLeft extends React.Component {
	constructor(props) {
		super(props);
		this.db = new DB();
		this._isMounted = false;
		this.state = {
			categories: []
		};
		this.commonService = new CommonService(this.db);
	}

	componentDidMount() {
		this._isMounted = true;
		this.commonService.getAllCategories().then((categories) => {
			if (categories && categories.length) {
				this.setState({
					categories: categories,
				})
			}
			else {
				fetch(Web.BaseUrl + "api/v1/all-categories")
					.then(res => res.json())
					.then(
						(result) => {
							this.db.insert("settings", result.data, 'allCategories');
							this._isMounted && this.setState({
								isLoaded: true,
								categories: result.data
							});
						},
						// Note: it's important to handle errors here
						// instead of a catch() block so that we don't swallow
						// exceptions from actual bugs in components.
						(error) => {
							this._isMounted && this.setState({
								isLoaded: true,
								error
							});
						}
					)
			}
		})

	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	render() {
		return (
			<div className="col-12">
				<h5>Categories</h5>
				<ul className="nav flex-column flex-nowrap overflow-hidden">
					{this.state.categories.map((value, index) => {
						var name = value.name.replace(/\s+/g, '-').toLowerCase();
						return (
							<li data-key={value.id} key={index} className="nav-item">
								<a className="nav-link text-truncate" href={"#submenu" + value.id} data-toggle="collapse" data-target={"#submenu" + value.id}>
									<i className="glyphicon glyphicon-align-justify"></i>
									<span className="d-none d-sm-inline">{value.name}</span>
								</a>
								<div className="collapse" id={"submenu" + value.id} aria-expanded="false">
									<ul className="flex-column pl-2 nav">
										{value.subcategories.map((v, i) => {
											var subname = v.name.replace(/\s+/g, '-').toLowerCase();
											return (
												<li key={i} className="nav-item">
													<Link className="nav-link py-0" data-key={v.id} to={'/products/category/' + v.id + '/' + subname} key={i}>
														<span>{v.name}</span>
													</Link>
												</li>
											)
										})}
									</ul>
								</div>
							</li>
						)
					})}
				</ul>
			</div>
		)
	}
}
export default CategoryLeft;