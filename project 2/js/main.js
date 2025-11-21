//user clicks on search button 
window.onload = (e) => {document.querySelector("#searchButton").onclick = searchButtonClicked}; 

let displayTerm = "";

function searchButtonClicked(){
    console.log("search button function started"); 

    const Rick_Morty_URL = "https://rickandmortyapi.com/api/character"; 
    //can't find a api key hopefully don't need one 

    let url = Rick_Morty_URL; 

    let searchTerm = document.querySelector("#searchBar").value; //grab user input 
    displayTerm = searchTerm; 

    //parse user input 
    term = term.trim(); //get rid of leading & trailing spaces 
    term = encodeURIComponent(term); //encoded representation in UTF-8 
    
    if(term.length < 1) return; //no input was given 

    url += "?name=" + term; //add to url -- user can only typle in char names 
    


}