//user clicks on search button 
window.onload = (e) => {document.querySelector("#searchButton").onclick = SearchButtonClicked}; 

const searchBar = document.querySelector("#searchBar"); 
let displayTerm = "";

//local storage 
let lastSearch = "charSearched"; //declare storage variable 
const storedTerm = localStorage.getItem(lastSearch); //stored data 
if(storedTerm){
    searchBar.value = storedTerm; 
}else{
    searchBar.value = "Rick";
}

function SearchButtonClicked()
{
    //change CSS to account for search 
    document.getElementById("searchFeature").style.margin = '2px 0px'; 
   

    const Rick_Morty_URL = "https://rickandmortyapi.com/api/character"; 
    let url = Rick_Morty_URL; 

    let searchTerm = document.querySelector("#searchBar").value; //grab user input 
    displayTerm = searchTerm; 

    //parse user input 
    searchTerm = searchTerm.trim(); //get rid of leading & trailing spaces 
    searchTerm = encodeURIComponent(searchTerm); //encoded representation in UTF-8 
    
    if(searchTerm.length < 1)
    {
        document.querySelector("#content").innerHTML = "Please enter a search term in the bar"; 
        return; //no input was given 
    } 

    url += "?name=" + searchTerm; //add to url -- user can only typle in char names 
    //the additions of filters here

    document.querySelector("#status").innerHTML = "Finding '" + displayTerm + "' broh"; 
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

    let obj = JSON.parse(xhr.responseText); //doesn't work for other search terms 

    if(!obj.results || obj.results.length == 0) //if there are no results, print a message and return 
		{
			document.querySelector("#status").innerHTML = "Can't find anything for '" + displayTerm + "' broh"
			let nothingLine = `<div class='result'><img src='${"media/cant-find.jpg"}'/>`; 
            document.querySelector("#content").innerHTML = nothingLine; 
            return; 
		}

		//display to the user 
		let results = obj.results; 
		let bigString = ""; //HTML string for user result

		for(let i = 0; i < results.length; i++)
		{
			let result = results[i]; 
			let smallURL = result.image; 
		    //api comes with a default image if no image is avaliable 

            let userChoice = document.getElementById("filterList").selectedOptions;
            let valuesCollected = Array.from(userChoice).map(({value}) => value); 
			//build div to hold the results
			let line = `<div class='result'><img src='${smallURL}' title= '${result.id}' />`; 
            line += `<span><p> ${result.name}</p>`; 
            if(valuesCollected.length > 0){
                for(let i = 0; i < valuesCollected.length; i++){
                    if(valuesCollected[i] == "life"){
                        line += `<p> Status: ${result.status}</p>`;
                    }

                    if(valuesCollected[i] == "origins"){
                        line += `<p>Origin: ${result.origin.name}</p>`;
                    }

                    if(valuesCollected[i] == "species"){
                        line += `<p>Species: ${result.species}</p>`; 
                    }
                }
            }

            line += `</span></div>`; 

            //don't display anything for this char if the user only wants to see chars with pictures 
            if(result.image == "https://rickandmortyapi.com/api/character/avatar/19.jpeg" && 
                document.getElementById("hideDefaultImg").checked)
            {
               line = ``;  
            }

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
	}
+
    // function GetEpisodeData(url)
    // {
    //     console.log("ive reached getepisodedata() !!"); 
    //     let xhr = new XMLHttpRequest(); 

    //     xhr.onload = EpisodeDataOutput(); 
    //     xhr.onerror = EpisodeDataOutput(); 

    //     xhr.open("GET", url); 
    //     xhr.send(); 
    // }

    // function EpisodeDataOutput(e)
    // {
    //     console.log("trying to display episode now"); 
    //     let xhr = e.target; 
    //     let firstEpisode = ""; 
    //     console.log(xhr.responseText); 
    //     console.log(xhr.responseText.length); 

    //     let obj = JSON.parse(xhr.responseText); 
    //     console.log(obj); 
    //     console.log(obj.name); 
        
    //     console.log(firstEpisode); 
    //     let line = `<div class='results'><span><p>First Seen In: ${obj.episode} ${obj.name}</p></span></div>`; 

    //     document.querySelector("#content").innerHTML = line; 

    // }

	function DataError(e)
	{
		console.log("an error occured"); 
	}

    //save of term from the serach bar every time a new one is typed 
   searchBar.onchange = e=>{localStorage.setItem(lastSearch, e.target.value);};
	