import React from 'react';

export const loadLocalStorageData = () => {
	var userId = localStorage.getItem('userId');
	var displayName = localStorage.getItem('displayName');

	console.log(userId);
	console.log(displayName);
};