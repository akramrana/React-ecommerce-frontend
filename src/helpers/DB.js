import React, { Component } from 'react';

const db_version = 1;

class DB extends Component{
	constructor() {
		super();
		let request = indexedDB.open("shopping",db_version);
		request.onupgradeneeded = function(event) {
		  	  let db = request.result;
			  if (!db.objectStoreNames.contains('settings')) {
			    db.createObjectStore('settings',{autoIncrement: true});
			  }
		};
		request.onerror = function(event) {
		  	console.log("Why didn't you allow my web app to use IndexedDB?!");
		};
		request.onsuccess = function(event) {
		  	//console.log("Connected");
		};
	}

	insert(table,data,key){
		let request = indexedDB.open("shopping",db_version);
		request.onsuccess = function(event) {
			let db = request.result;
			let transaction = db.transaction(table, "readwrite");
			let tableObj = transaction.objectStore(table);
			let insert = tableObj.put(data,key);
			//
			insert.onsuccess = function() {
			  //console.log("Data added to the key", insert.result);
			}
			insert.onerror = function() {
			  console.log("Error", insert.error);
			};
		}
	}

	getOne(table,key){
		let request = indexedDB.open("shopping",db_version);
		return new Promise(function(resolve, reject) {
			request.onsuccess = function(event) {
				let db = request.result;
				let transaction = db.transaction(table, "readwrite");
				let tableObj = transaction.objectStore(table);
				let dataRequest = tableObj.get(key);
				dataRequest.onsuccess = function(event) {
					resolve(dataRequest.result);
				}
				dataRequest.onerror = function(event) {
					reject(dataRequest.error);
				}
			}
		})
	}

	delete(table,key){
		let request = indexedDB.open("shopping",db_version);
		request.onsuccess = function(event) {
				let db = request.result;
				let transaction = db.transaction(table, "readwrite");
				let tableObj = transaction.objectStore(table);
				let deleteKey = tableObj.delete(key);
				deleteKey.onsuccess = function() {
				  //console.log("key deleted from the table", deleteKey.result);
				}
				deleteKey.onerror = function() {
				  console.log("Error", deleteKey.error);
				};
		}
	}

}
export default DB;