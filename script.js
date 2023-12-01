//the starter code comes from https://webtips.dev/memory-game-in-javascript
// this code goes in and grabs these elements from the HTML
const selectors = {
    boardContainer: document.querySelector('.board-container'),
    board: document.querySelector('.board'),
    moves: document.querySelector('.moves'),
    timer: document.querySelector('.timer'),
    start: document.querySelector('button'),
    win: document.querySelector('.win')
}

//There are 5 states that could possibly happengame started can be true or false
//flipped totalflips and totaltime count the time
const state = {
    gameStarted: false,
    flippedCards: 0,
    totalFlips: 0,
    totalTime: 0,
    loop: null
}

// Shuffle will pass in an array of pictures and shuffle it for the cards
const shuffle = array => {
    const clonedArray = [...array]

    //this loop goes through the the cloned array from the last thing to the first and then sets 
    //the original array to the index of the cloned array which is backwards and thensets it to 
    //a random index and sets that to the origina 
    for (let index = clonedArray.length - 1; index > 0; index--) {
        //creates random index
        const randomIndex = Math.floor(Math.random() * (index + 1))
        //sets original array to it 
        const original = clonedArray[index]
        //creates random array
        clonedArray[index] = clonedArray[randomIndex]
        //sets original array to it 
        clonedArray[randomIndex] = original
    }

    return clonedArray
}

//pick random choses a card mulitple times
const pickRandom = (array, items) => {
    const clonedArray = [...array]
    const randomPicks = []
    //adds things in randomly
    for (let index = 0; index < items; index++) {
        const randomIndex = Math.floor(Math.random() * clonedArray.length)
        //pushing a cloned array to the 
        randomPicks.push(clonedArray[randomIndex])
        clonedArray.splice(randomIndex, 1)
    }
    //returns 1 array
    return randomPicks
}

const generateGame = () => {
    //gets the dimensions set in the html
    const dimensions = selectors.board.getAttribute('data-dimension')

    if (dimensions % 2 !== 0) {
        throw new Error("The dimension of the board must be an even number.")
    }
    // const images = [
    //     'prophase1.png',
    //     'prophase2.png',
    //     'metaphase1.png'
    //             ];
             
    //             const container = document.getElementById('image-container');
             
    //             for (let i = 0; i < images.length; i++) {
    //                 const img = document.createElement('img');
    //                 img.src = images[i];
    //                 container.appendChild(img);
    //             }



// Push the URLs to three images to arrayOfImages

    //pics
    const emojis = ['images/Prophase1.png','images/Prophase2.png','images/Metaphase1.png','images/Metaphase2.png','images/Anaphase1.png','images/Anaphase2.png','images/Telophase1.png','images/Telophase2.png',]
    //randomly picks card
    const picks = pickRandom(emojis, (dimensions * dimensions) / 2) 
    //then shuffles those cards
    const items = shuffle([...picks, ...picks])
    console.log(items)
    //creates cards 
    const cards = `
        <div class="board" style="grid-template-columns: repeat(${dimensions}, auto)">
            ${items.map(item => `
                <div class="card">
                    <div class="card-front"></div>
                    <div class="card-back">
                    
                    <img src=${item}  height="100" width="100"> 
                    ${item}
                    </img>
                    
                    </div>
                </div>
            `).join('')} 
       </div>
    `
    
    
    const parser = new DOMParser().parseFromString(cards, 'text/html')
    //replaces the board with the newly generated one 
    selectors.board.replaceWith(parser.querySelector('.board'))
}
// start game sets start gamne to true
const startGame = () => {
    state.gameStarted = true
    //all the selectors are disabled 
    selectors.start.classList.add('disabled')
    //loop gets ser to the timer
    state.loop = setInterval(() => {
        //every 1000 millisecons total time goes up
        state.totalTime++
        //moves gets set and time gets set
        selectors.moves.innerText = `${state.totalFlips} moves`
        selectors.timer.innerText = `time: ${state.totalTime} sec`
    }, 1000)
}
// checking to see if the cards are matched and then if they aren't then
const flipBackCards = () => {
    document.querySelectorAll('.card:not(.matched)').forEach(card => {
        //this is is super smart, it sets the classlist back to nothing
        card.classList.remove('flipped')
    })
// and the flipped cards state back to zero
    state.flippedCards = 0
}
//then flip card 
const flipCard = card => {
    state.flippedCards++
    state.totalFlips++
// start game if the game isn't started
    if (!state.gameStarted) {
        startGame()
    }
//if there are 1 or two cards flipped set the classlist to flipped
    if (state.flippedCards <= 2) {
        card.classList.add('flipped')
    }
//check to see if the cards are a match
    if (state.flippedCards === 2) {
        const flippedCards = document.querySelectorAll('.flipped:not(.matched)')
        //if they match, keep them up
        if (flippedCards[0].innerText === flippedCards[1].innerText) {
            //set the classlist to matched if mathced 
            flippedCards[0].classList.add('matched')
            flippedCards[1].classList.add('matched')
        }
        //after a certain amount of time call flipback cards to check if theres a match
        setTimeout(() => {
            flipBackCards()
        }, 1000)
    }

    // If there are no more cards that to flip, its finished 
    if (!document.querySelectorAll('.card:not(.flipped)').length) {
        setTimeout(() => {
            //show the winning text
            selectors.boardContainer.classList.add('flipped')
            selectors.win.innerHTML = `
                <span class="win-text">
                    You won!<br />
                    with <span class="highlight">${state.totalFlips}</span> moves<br />
                    under <span class="highlight">${state.totalTime}</span> seconds
                </span>
            `
//cancels the timed action
            clearInterval(state.loop)
        }, 1000)
    }
}
//adding in the listeners for the clicks 
const attachEventListeners = () => {
    document.addEventListener('click', event => {
        //get the target of the event
        const eventTarget = event.target
        const eventParent = eventTarget.parentElement
        //add flipped to the classname if a card is flipped
        if (eventTarget.className.includes('card') && !eventParent.className.includes('flipped')) {
            //then call flipcard on that parent
            flipCard(eventParent)
            //starts the game if it hasnt started yet
        } else if (eventTarget.nodeName === 'BUTTON' && !eventTarget.className.includes('disabled')) {
            startGame()
        }
    })
}

generateGame()
attachEventListeners()