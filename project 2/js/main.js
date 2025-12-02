//user clicks on search button 
window.onload = (e) => {document.querySelector("#searchButton").onclick = SearchButtonClicked}; 

let displayTerm = "";
let lastSearch; //declare storage variable 

function SearchButtonClicked()
{
    console.log("search button function started"); 

    const Rick_Morty_URL = "https://rickandmortyapi.com/api/character"; 
    //can't find a api key hopefully don't need one 

    let url = Rick_Morty_URL; 

    let searchTerm = document.querySelector("#searchBar").value; //grab user input 
    displayTerm = searchTerm; 
    lastSearch = localStorage.getItem(displayTerm); //storing last term searched

    //parse user input 
    searchTerm = searchTerm.trim(); //get rid of leading & trailing spaces 
    searchTerm = encodeURIComponent(searchTerm); //encoded representation in UTF-8 
    
    if(searchTerm.length < 1) return; //no input was given 

    url += "?name=" + searchTerm; //add to url -- user can only typle in char names 
    //the additions of filters here

    document.querySelector("#status").innerHTML = "Finding '" + displayTerm + "' broh"; 

    console.log(url); 
    GetData(url); 
}

function GetData(url){
    let xhr = new XMLHttpRequest(); 
    // if(isEpisode)
    // {
    //     xhr.onload = EpisodeDataHandler(); 
    //     xhr.onerror = EpisodeDataHandler(); 
    // }

    xhr.onload = DataLoaded; 
    xhr.onerror = DataLoaded; 

    xhr.open("GET", url); 
    xhr.send(); 
}

function DataLoaded(e) 
{
    let xhr = e.target; 
    console.log("target" + e.target);  
    console.log(xhr.responseText); 
    console.log(xhr.responseText.length); 

    let obj = JSON.parse(xhr.responseText); //doesn't work for other search terms 
    console.log(obj); 
    console.log(obj.results); 
    //console.log(obj.data.length); 

    if(!obj.results || obj.results.length == 0) //if there are no results, print a message and return 
		{
			document.querySelector("#status").innerHTML = "Can't find anything for '" + displayTerm + "' broh"
			let nothingLine = `<div class='result'><img src='${"media/cant-find.jpg"}' />`; 
            document.querySelector("#content").innerHTML = nothingLine; 
            return; 
		}

		//display to the user 
		let results = obj.results; 
		console.log("results.length = " + results.length); 
		let bigString = ""; //HTML string for user result

		for(let i = 0; i < results.length; i++)
		{
			let result = results[i]; 
			let smallURL = result.image; 
		    //api comes with a default image if no image is avaliable 

			//build div to hold the results
			let line = `<div class='result'><img src='${smallURL}' title= '${result.id}' />`; 
			line += `<span><p> ${result.name}</p>`; 
			line += `<p>Origin: ${result.origin.name}</p></span></div>`;
            //trying to display episode title 

            // let episodeURL = result.episode[0]; 
            // console.log(episodeURL); 
            // GetEpisodeData(episodeURL); //episodes are their own data set -- says the function is undefined??? 
            // //line += `<p>Episode First Seen in: ${result.episode[0].name} </p></div>`

			bigString += line; //store the HTML that is to be shown to the user 
		}

		//updates the div section marked with the content id to display the search results 
			//finds the first HTML element that matches the specified id and accesses the content with the element via the .innerHTML property 
				//you can get or set the .innerHTML property 
        let title = `<h2>Results</h2>`
        document.querySelector("#contentTitle").innerHTML = title; 
		document.querySelector("#content").innerHTML = bigString; 
		document.querySelector("#status").innerHTML = "<b>Success!</b><p><i>Here are " + results.length + " results for '" + displayTerm + "'</i></p>"; //updates the text below the search button 

        //local storage 
        console.log(lastSearch); 
	}
+
    function GetEpisodeData(url)
    {
        console.log("ive reached getepisodedata() !!"); 
        let xhr = new XMLHttpRequest(); 

        xhr.onload = EpisodeDataOutput(); 
        xhr.onerror = EpisodeDataOutput(); 

        xhr.open("GET", url); 
        xhr.send(); 
    }

    function EpisodeDataOutput(e)
    {
        console.log("trying to display episode now"); 
        let xhr = e.target; 
        let firstEpisode = ""; 
        console.log(xhr.responseText); 
        console.log(xhr.responseText.length); 

        let obj = JSON.parse(xhr.responseText); 
        console.log(obj); 
        console.log(obj.name); 
        
        console.log(firstEpisode); 
        let line = `<div class='results'><span><p>First Seen In: ${obj.episode} ${obj.name}</p></span></div>`; 

        document.querySelector("#content").innerHTML = line; 

    }

	function DataError(e)
	{
		console.log("an error occured"); 
	}
	