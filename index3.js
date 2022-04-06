function previewPower(board){
    console.log(board.powerUps)
if(board.powerUps[1].stat && !board.powerUps[1].used) {
  let disablePrev=false;
    let previouslyFlipped=[];
    console.log(board.cards)
    board.cards.forEach((card,i) => {
    if(card.flipped) previouslyFlipped.push(card.id);
    })
    if(!disablePrev){
    disablePrev=true;
    board.cards.forEach((card) =>{
    board.cardItems[card.id].classList.add("flipped");
    card.flipped=true;
  })
    setTimeout(() => {
      board.cards.forEach((card) =>{
        if(previouslyFlipped.indexOf(card.id) < 0) {
          board.cardItems[card.id].classList.remove("flipped");
        }
        card.flipped=false;
      })
      disablePrev=false;
      board.powerUps[1].stat=false;
      board.powerUps[1].used=true;
      board.powerUps[1].btn.classList.remove("bgcolor"); 
      board.powerUps[1].btn.classList.add("opacity");
      board.powerUps[1].btn.disabled=true;
    }, (700+board.powerUps[1].time * 1000));
    }
}
}

function threeXpowerup(board){
    if(board.powerUps[0].stat && !board.powerUps[0].used) {
        board.powerUps[0].used=true;
        board.powerUps[0].stat=false;
        board.flipChances=2;
        board.powerUps[0].btn.classList.remove("bgcolor"); 
        board.powerUps[0].btn.classList.add("opacity");
        board.powerUps[0].btn.disabled=true;
      }
}
