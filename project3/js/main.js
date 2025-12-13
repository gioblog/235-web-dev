//global varables 
    let moneyTracker = 0; 
    let customerSet = ["brownBear", "greyRabbit"]; 
    let orderSet = ["tiramisu", "cocoa"]; 
    //make a randomized array out of the array of possible objects and then go through each one to use as the next customer 
    let randCustomers = []; //group of customers
    let randOrders = []; 
    let currentCustomer = null; //individual customer 
    let secondInterval = null; 

    window.onload = (e) => {document.querySelector("#startButton").onclick = StartGame}

    function StartGame()
    {
        //add HUD & audio 
        let audio = document.getElementById("backgroundJams"); 
        audio.play(); 
        let headsUp = `<h3 id="timer">0:00</h3>`; 
        headsUp += `<h3 id="money">$0</h3> `;
        document.getElementById("HUD").innerHTML = headsUp; 

        randCustomers = RandomSort(customerSet); 
        randOrders = RandomSort(orderSet); 

        document.getElementById("startButton").remove(); //bye bye play button 

        GameTurn(); //first customer 

        //add items in shop 
        let stock = `<img id="drink1" data-orderAppearance="cocoa" src="media/cocoa.png"  draggable="true" ondragstart="dragStartHandler(event)"/>`;
        stock += `<img id="food1" data-orderAppearance="tiramisu" src="media/tiramisu.png" draggable="true"   ondragstart="dragStartHandler(event)" /  >`;

        document.getElementById("cafeItems").innerHTML = stock; 
    }

    //represents a turn (an order) within the game which is basically just managing customers 
    function GameTurn() 
    {
        ResetTimer(); //reset the timer before adding new customer 

        //customer setup
        if(currentCustomer != null)
        {
            currentCustomer.remove();     
        }

        let customer = randCustomers.pop();
        let order = randOrders.pop(); 
        currentCustomer = new CustomerOrder(customer, order); 
        currentCustomer.image(); //visually add character to scene 

        //timer for orders 
        let customerPatience = Math.floor(Math.random() * (4 - 1) + 1); //randomly chooses a time between 1 and 4(exclusive) seconds to complete an order 
        let display = document.getElementById("timer"); 
        orderCountdown(customerPatience, display); 
    }

    function ResetTimer()
    {
        if(secondInterval != null)
        {
            clearInterval(secondInterval); 
            secondInterval = null; 
        }
    }

   
    // drag & drop needed functions 
    //dragging an item 
    function dragStartHandler(e)
    {
        const item = e.target.getAttribute('data-orderAppearance'); 
        e.dataTransfer.setData("text/plain", item); 

    }

    function dragOverHandler(e)
    {
        e.preventDefault(); //allow a drop happen on this element by ignoring the default case (no drops on the element can occur)
    }

    //when the element is released 
    //the player has to drop the item onto the speech bubble 
    function dropHandler(e)
    {
        e.preventDefault(); //default case: opens as a link 
        const data = e.dataTransfer.getData("text/plain"); //collect Id of the drop (the data that is targeted in the start function)
        //check if the dataset is the same as the order  
        if(e.currentTarget.getAttribute('data-orderAppearance') == data)
        {
            resolveTurn(true);  
        } else { 
            resolveTurn(false);  
        }
        
    }
    
    //passes a bool to see if it should add to the money total or subtract 
    function resolveTurn(positive)
    {
        ResetTimer(); 

        if(positive)
        {
            moneyTracker += 5; 
        } 
        else
        {
            moneyTracker -= 2; 
        }

        // customer has finished shift
        if(randCustomers.length === 0){
            setTimeout (() => { //transition delay 
                alert("You have served all the customers and earned $" + moneyTracker + " for the cafe. Reload the tab if you want to play another shift. Amazing work :D"); 
            }, 500); 
            //resetting game space
            currentCustomer.remove(); 
            ResetTimer(); 
            document.getElementById("cafeItems").innerHTML = ""; 
            document.getElementById("HUD").innerHTML = ""; 
            setTimeout(() => {
                document.getElementById("startGame").innerHTML = `<button type="button" id="startButton">Play</button>`;
            }), 200; 
            // document.getElementById("startButton").onclick = StartGame(); => seems that when player clicks ok on alert it activates the play button or smthing 
            return; 
        } else{
            setTimeout(() => { //transition delay 
                cleanUp(); 
            }, 100);
        }
    }

    function cleanUp()
    {
        ResetTimer(); 
        document.getElementById("timer").innerHTML = "0:00"; 
        updateMoneyDisplay(); 
        GameTurn(); 
    }

    //Fisher-Yates algorithm to randomly sort array
    function RandomSort(array)
    {
        for(let i = array.length - 1; i > 0; i--)
        {
            let randIndex = Math.floor(Math.random() * (i + 1)); 
            //swap elements 
            let k = array[i]; 
            array[i] = array[randIndex]; 
            array[randIndex] = k; 
        } 
        return array; //sorted array 
        //return Math.floor(Math.random() * int)
    }

    //makes a countdown for each "turn" in the game 
    function orderCountdown(duration, display)
    {
        ResetTimer(); 
        let timer = duration, seconds
        secondInterval = setInterval( function() {
            seconds = parseInt(timer % 60, 10);

            seconds = seconds < 10 ? "0" + seconds : seconds; 
            display.textContent = 0 + ":" + seconds; 
            timer--; 
            if(timer < 0){
                ResetTimer();
                timer = duration; 
                resolveTurn(false); //customer patience ran out 
            }
        }, 1000); 
    }

    //updates money display 
    function updateMoneyDisplay()
    {
        const playerMoney = document.getElementById("money"); 
        playerMoney.textContent = "$" + moneyTracker;  
        playerMoney.style.transform = "scale(2)"; 
        setTimeout(() => {
            playerMoney.style.transform = ""; 
        }, 300);
    }

    // ES6 Requirement 
    //class that creates a customer object when given the customer type & order type 
    class CustomerOrder
    {
        constructor(customer, item)
        {
            //both were popped off their respective arrays 
            this.customer = customer; 
            this.item = item; 
        }

        image() //adding the images of the customer and their order 
        {
            document.querySelector(".customers").classList.add(this.customer); 
            document.querySelector(".customers").setAttribute("data-customerAppearance", this.customer); 

            document.querySelector(".orderDisplayed").classList.add(this.item); 
            document.querySelector(".orderDisplayed").setAttribute("data-orderAppearance", this.item); 
            document.querySelector("#speechBubble").innerHTML = `<img src='${"media/speech.png"}'/>`; //include speech bubble
        }

        remove()
        {
            const customerDiv = document.querySelector(".customers"); 
            const orderDiv = document.querySelector(".orderDisplayed"); 

            //remove classes & attributes 
            customerDiv.classList.remove(this.customer); 
            customerDiv.removeAttribute("data-customerAppearance"); 
            orderDiv.classList.remove(this.item); 
            orderDiv.removeAttribute("data-orderAppearance"); 
            document.querySelector("#speechBubble").innerHTML = "";

            this.isActive = false; 
        }
    }