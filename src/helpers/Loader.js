import React, { Component } from 'react';

class Loader extends Component {

	constructor(props) {
	    super(props);
	}

	show(){
		document.getElementById("preloader").style.display = 'block';
	}

	hide(){
		document.getElementById("preloader").style.display = 'none';
	}
}

export default Loader;