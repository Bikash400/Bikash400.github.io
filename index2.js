//Array Shuffle Function
function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
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


/**Utility functions */
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

  function cardMatch(flippedCards,board){
      let matchedIndex=[];
      if(flippedCards[0].cardId == flippedCards[1].cardId){
          matchedIndex.push(flippedCards[0].id, flippedCards[1].id)
          board.cards[flippedCards[0].id].flipped=true;
          board.cards[flippedCards[1].id].flipped=true;
      }
      if(flippedCards[2]){
        if(flippedCards[1].cardId == flippedCards[2].cardId){
            matchedIndex.push(flippedCards[1].id, flippedCards[2].id)
            board.cards[flippedCards[1].id].flipped=true;
          board.cards[flippedCards[2].id].flipped=true;
        }else if(flippedCards[0].cardId == flippedCards[2].cardId){
            matchedIndex.push(flippedCards[0].id, flippedCards[2].id)
            board.cards[flippedCards[0].id].flipped=true;
          board.cards[flippedCards[2].id].flipped=true;
        }
      }
      return matchedIndex;
  }
 
  // Restart HTML Elements
  const restartBtn = document.querySelector(".restart-btn");
  const gameOverText = document.querySelector(".gameover-text");
  const container = document.querySelector(".container"); //Board
  
  var board=undefined;
  //Generate New board when game starts
  function generateBoard(noOfflipChances=2) {
    var powerUps =[
      {name:"3x",used:false,stat:false,btn:document.querySelector(".btn-3x")},
      {name:"flip",time:2,used:false,stat:false,btn:document.querySelector(".btn-flipAll")}
    ]
    const ids = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7]; //Image Id
    const idsShuffled = shuffle(ids); // Image Ids shuffled
    const board = { gameOver: false,flipChances:noOfflipChances, cards: [], cardItems:[], powerUps:powerUps }; // Track of cards & gameOver
    //renders the cards
    document.querySelector(".game-board").classList.remove("hide");
    container.innerHTML = ""; // Cleans the previously rendered cards
    for (let i = 0; i < 16; i++) {
      board.cards[i] = new Card(i, idsShuffled[i]); // Creates new card object for each card
      container.innerHTML += board.cards[i].template;
    }
    const cardItems = document.querySelectorAll(".item");
    board.cardItems=cardItems;
    //Add Click event to each card
    let flippedCards = [],
      noOfMatches = 0,
      flipNumber=0,
      matchedIndex=[],
      flippedCardsId=[],
      cycleRunning = false;

      cardItems.forEach((card, i) => {
        card.addEventListener("click", (e) => {
          console.log(noOfMatches);
            let current =board.cards[i];  // Current Card Which is selected from board based on id
            if (!cycleRunning && !board.gameOver && !current.flipped) {
              card.classList.add("flipped"); // Flips the clicked card
                    board.cards[current.id].flipped=true;
                  if (flippedCards.length > 0) {
                    flipNumber+=1;
                    flippedCards.push(current);
                    flippedCardsId=flippedCards.map((v,i) => v.id);
                    matchedIndex=cardMatch(flippedCards,board);
                    if(matchedIndex.length > 0){
                      cycleRunning=true;
                      noOfMatches += 1; 
                        flippedCardsId.forEach((cardIndx,i) =>{
                          if(matchedIndex.indexOf(cardIndx) < 0){
                            setTimeout(() => {
                              shake([cardIndx], "add");
                              setTimeout(() => {
                                if(!board.gameOver){
                                  removeFlip(cardIndx);
                                }
                                shake([cardIndx], "remove");
                                board.cards[cardIndx].flipped=false;
                              }, 600);
                            }, 700); 
                          }
                          setTimeout(()=>{
                            threeXpowerup(board);
                            flippedCards = [];
                            flipNumber=0;
                            matchedIndex=[];
                            cycleRunning = false;
                          },1300)
                          
                        })
                    }else{
                        if(board.flipChances == flipNumber){
                            cycleRunning=true;
                            setTimeout(() => {
                                shake(flippedCardsId, "add");
                                setTimeout(() => {
                                  if(!board.gameOver){
                                      flippedCardsId.forEach((cardId,i) =>{
                                          removeFlip(cardId);;
                                      })
                                  }
                                  shake(flippedCardsId, "remove");
                                  cycleRunning = false;
                                  flippedCards.forEach((card,i) =>{
                                    board.cards[card.id].flipped=false;
                                })
                                threeXpowerup(board)
                                  flippedCards = [];
                                  flipNumber=0;
                                }, 600);
                              }, 700);
                              
                        }
                    }
                  }else{
                    flippedCards.push(current);
                    flipNumber+=1;
                  }
                  if (noOfMatches == board.cards.length / 2) board.gameOver = true;
                  if (board.gameOver) {
                    gameOverText.classList.remove("hide");
                    setTimeout(() => gameOverText.classList.add("visible"), 10);
                    restartBtn.innerHTML="Restart";
                  }
            }
        });
      });
      return board;
  }

  //Restart button
  var disableBtn=false;
  restartBtn.addEventListener("click", (e) => {
    if(!disableBtn){
        if(board.gameOver){
            board.cardItems.forEach((card, i) => card.classList.remove("flipped"));
            disableBtn=true;
            setTimeout(() =>{ 
              board = generateBoard();
              disableBtn =false;
              gameOverText.classList.add("hide");
              board.powerUps.forEach((power) =>{
                power.btn.classList.remove("bgcolor");
                power.btn.disabled=false;
              })
              console.log(board.powerUps)
            }, 800);
            e.target.innerHTML="Show";

        }else{
            board.cardItems.forEach((card, i) => card.classList.add("flipped"));
            disableBtn=true;
            setTimeout(() => disableBtn =false,700);
            e.target.innerHTML="Restart";
            board.gameOver=true;

        }
    }
  });

  document.querySelector(".start-btn").addEventListener("click",()=>{
    document.querySelector(".game-start").classList.add("hide");
    board = generateBoard();
  })

  document.querySelector(".btn-3x").addEventListener("click",(e)=>{
    if(!board.powerUps[0].used && !board.gameOver){
      board.flipChances=3;
      board.powerUps[0].stat=true;
      board.powerUps[0].btn.classList.add("bgcolor")
    }
  })

  document.querySelector(".btn-flipAll").addEventListener("click",(e) =>{
    if(!board.powerUps[1].used && !board.gameOver){
      board.powerUps[1].stat=true;
      board.powerUps[1].btn.classList.add("bgcolor");
      previewPower(board);
    }
  })
