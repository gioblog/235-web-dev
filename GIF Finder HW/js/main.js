 // 1
  	window.onload = (e) => {document.querySelector("#search").onclick = searchButtonClicked};
	
	// 2
	let displayTerm = "";
	
	// 3
	function searchButtonClicked(){
		console.log("searchButtonClicked() called");
		
		const GIPHY_URL = "https://api.giphy.com/v1/gifs/search?"; 

		//public API key - used to track and control how the API is being used 
			//I created my own from GIPHY website 
		let GIPHY_KEY = "Y1tNHAB3pTOgnCzpSe0QMibptZnsMzy7"; 

		let url = GIPHY_URL;
		url += "api_key=" + GIPHY_KEY; 
		
		//parse through user input 
		let term = document.querySelector("#searchterm").value; 
		displayTerm = term; 

		term = term.trim(); //gets rid of leading and trailing spaces 

		//replaces special characters(including spaces) with its encoded representation in UTF-8
		term = encodeURIComponent(term); 

		if(term.length < 1) return; 

		url += "&q=" + term; //adds search term to url 

		let limit = document.querySelector("#limit").value; 
		url += "&limit=" + limit; 

		//update UI
		document.querySelector("#status").innerHTML = "<b>Searching for '" + displayTerm + "'</b>"; 

		console.log(url); 
		getData(url);
	}

	function getData(url)
	{
		let xhr = new XMLHttpRequest(); //create a new XHR object
		xhr.onload = dataLoaded; //set the load handler 
		xhr.onerror = dataLoaded; //set the error handler 

		//open two-way communication & send request 
		xhr.open("GET", url); 
		xhr.send(); 
	}

	//callback functions 
	function dataLoaded(e)
	{
		let xhr = e.target; 
		console.log(xhr.responseText); //disengage with the JSON file that was downloaded
		
		let obj = JSON.parse(xhr.responseText); //turn text into JavaScript object 	
		if(!obj.data || obj.data.length == 0) //if there are no results, print a message and return 
		{
			document.querySelctor("#status").innerHTML = "<b>No results for '" + displayTerm + "'</b>"
			return; 
		}

		//display to the user 
		let results = obj.data; 
		console.log("results.length = " + results.length); 
		let bigString = ""; //HTML string for user result

		for(let i = 0; i < results.length; i++)
		{
			let result = results[i]; 
			let smallURL = result.images.fixed_width_downsampled.url; 
			if(!smallURL) smallURL = "images/no-image-found.png"; //when no result is found for the search 

			let url = result.url; //url to GIPHY page 

			//build div to hold the results - could also use concatenation, but that is messy 
			let line = `<div class='result'><img src='${smallURL}' title= '${result.id}' />`; 
			line += `<span><a target='_blank' href='${url}'>View on Giphy</a>`; 
			line += `<p>Rating: ${result.rating.toUpperCase()}</p></span></div>`; 

			bigString += line; //store the HTML that is to be shown to the user 
		}

		//updates the div section marked with the content id to display the search results 
			//finds the first HTML element that matches the specified id and accesses the content with the element via the .innerHTML property 
				//you can get or set the .innerHTML property 
		document.querySelector("#content").innerHTML = bigString; 
		document.querySelector("#status").innerHTML = "<b>Success!</b><p><i>Here are " + results.length + " results for '" + displayTerm + "'</i></p>"; //updates the text below the search button 
	}

	function dataError(e)
	{
		console.log("an error occured"); 
	}
	