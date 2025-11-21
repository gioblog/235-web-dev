//user clicks on search button 
window.onload = (e) => {document.querySelector("#searchButton").onclick = searchButtonClicked}; 

let displayTerm = "";

function searchButtonClicked()
{
    console.log("search button function started"); 

    const Rick_Morty_URL = "https://rickandmortyapi.com/api/character"; 
    //can't find a api key hopefully don't need one 

    let url = Rick_Morty_URL; 

    let searchTerm = document.querySelector("#searchBar").value; //grab user input 
    displayTerm = searchTerm; 

    //parse user input 
    searchTerm = searchTerm.trim(); //get rid of leading & trailing spaces 
    searchTerm = encodeURIComponent(searchTerm); //encoded representation in UTF-8 
    
    if(searchTerm.length < 1) return; //no input was given 

    url += "?name=" + searchTerm; //add to url -- user can only typle in char names 
    //the additions of filters here

    document.querySelector("#status").innerHTML = "Finding '" + displayTerm + "' broh"; 

    console.log(url); 
    getData(url); 
}

function getData(url)
{
    let xhr = new XMLHttpRequest(); 
    xhr.onload = dataLoaded; 
    xhr.onerror = dataLoaded; 

    xhr.open("GET", url); 
    xhr.send(); 
}

function dataLoaded(e)
{
    let xhr = e.target; 
    console.log(xhr.responseText); 

    let obj = JSON.parse(xhr.responseText); 
    if(!obj.data || obj.data.length == 0) //if there are no results, print a message and return 
		{
			document.querySelector("#status").innerHTML = "Can't find anything for '" + displayTerm + "' broh"
			let nothingLine = `<div class='result'><img src='${media/cant-find.jpg}' />`; 
            return; 
		}

		//display to the user 
		let results = obj.data; 
		console.log("results.length = " + results.length); 
		let bigString = ""; //HTML string for user result

		for(let i = 0; i < results.length; i++)
		{
			let result = results[i]; 
			let smallURL = result.image.fixed_width_downsampled.url; 
			if(!smallURL) smalRL = "media/no-results.jpeg"; //when no result is found for the search 

			let url = result.lUurl; //url to GIPHY page 

			//build div to hold the results - could also use concatenation, but that is messy 
			let line = `<div class='result'><img src='${smallURL}' title= '${result.id}' />`; 
			line += `<span><p> ${result.name}</p>`; 
			line += `<p>Location: ${result.origin}</p></span>`;
            line += `<p>Episode First Seen in: ${result.episode[1]} </p></div>`

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
	