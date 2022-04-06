//Array Shuffle Function
function shuffle(array) {
    let currentIndex = array.length,
      randomIndex;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
  
    return array;
  }
  
  //Card Object
  function Card(id, cardId) {
    this.id = id;
    this.cardId = cardId;
    this.flipped = false;
    this.matched = false;
    this.template = `
        <div class="item" data-id=${this.id}>
        <div class="front card-face"></div>
        <div class="back card-face"><img src="svg/${this.cardId}.svg" /></div>
        </div>
        `;
  }
  
  function removeFlip(id) {
    document.querySelector(`[data-id='${id}']`).classList.remove("flipped");
  }
  
  function shake(ids, type) {
    ids.forEach((id, i) => {
      if (type == "add")
        document.querySelector(`[data-id='${id}']`).classList.add("shake");
      else if (type == "remove")
        document.querySelector(`[data-id='${id}'] `).classList.remove("shake");
    });
  }
  
  //Generate New board when game starts
  function generateBoard() {
    const container = document.querySelector(".container"); //Board
    const ids = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7]; //Image Id
    const idsShuffled = shuffle(ids); // Image Ids shuffled
    const board = { gameOver: false, cards: [], cardItems:[] }; // Track of cards & gameOver
    //renders the cards
    container.innerHTML = ""; // Cleans the previously rendered cards
    for (let i = 0; i < 16; i++) {
      board.cards[i] = new Card(i, idsShuffled[i]); // Creates new card object for each card
      container.innerHTML += board.cards[i].template;
    }
    const restartBtn = document.querySelector(".restart-btn");
    const gameOverText = document.querySelector(".gameover-text");
    const cardItems = document.querySelectorAll(".item");
    board.cardItems=cardItems;
    //Add Click event to each card
    let flippedCards = [],
      noOfMatches = 0,
      cycleRunning = false;
    cardItems.forEach((card, i) => {
      card.addEventListener("click", (e) => {
        let current =board.cards[i];  // Current Card Which is selected from board based on id
        /** Main Logic */
        if (!cycleRunning && !board.gameOver && !current.flipped) {
              // if(!current.matched){
                  card.classList.add("flipped"); // Flips the clicked card
                  board.cards[current.id].flipped=true;
                  // Checks if a another card is already flipped or not
                  if (flippedCards.length > 0) { 
                  flippedCards.push(current);
                    if (flippedCards[0].cardId != flippedCards[1].cardId) { // If previous card doesnot match current card
                      cycleRunning=true;
                      setTimeout(() => {
                        shake([flippedCards[0].id, flippedCards[1].id], "add");
                        setTimeout(() => {
                          if(!board.gameOver){
                              removeFlip(flippedCards[0].id);
                              removeFlip(flippedCards[1].id);
                          }
                          shake([flippedCards[0].id, flippedCards[1].id], "remove");
                          cycleRunning = false;
                          board.cards[flippedCards[0].id].flipped=false;
                          board.cards[flippedCards[1].id].flipped=false;
                          flippedCards = [];
                        }, 600);
                      }, 700);
                    } else { // If previous card matches current card
                          noOfMatches += 1; 
                          flippedCards = []; 
                          cycleRunning = false;
                    }
                  } else if(flippedCards.length == 0 ) {
                    flippedCards.push(current);
                  }
          
                  if (noOfMatches == board.cards.length / 2) board.gameOver = true;
                  if (board.gameOver) {
                    gameOverText.classList.remove("hide");
                    setTimeout(() => gameOverText.classList.add("visible"), 10);
                    restartBtn.innerHTML="Restart";
                  }
          
                  /** Main Logic */
          
              // }
          }
      });
    });
    return board;
  }
  
    var board = generateBoard();
    //Restart button
    var disableBtn=false;
    restartBtn.addEventListener("click", (e) => {
      if(!disableBtn){
          if(board.gameOver){
              board.cardItems.forEach((card, i) => card.classList.remove("flipped"));
              disableBtn=true;
              setTimeout(() =>{ board = generateBoard();disableBtn =false}, 800);
              e.target.innerHTML="Flip";
              gameOverText.classList.add("hide");
          }else{
              board.cardItems.forEach((card, i) => card.classList.add("flipped"));
              disableBtn=true;
              setTimeout(() => disableBtn =false,700);
              e.target.innerHTML="Restart";
              board.gameOver=true;
          }
      }
    });

  