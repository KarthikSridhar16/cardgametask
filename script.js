const suits = ['hearts', 'spades', 'diamonds', 'clubs']
const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"]

let fullDeck = []
let currentDraw = []
let selectedCards = []
let winningStreak = 0;
let isFlipping = false;

function generateFullDeck() {
    fullDeck = [];
    for(let suit of suits) {
        for(let rank of ranks) {
            // if(suit === 'joker' && (rank !== 'B' && rank !== 'R')){
            //         continue;
            // }
            // if((rank === 'B' || rank === 'R') && suit !== 'joker'){
            //             continue;
            //     }
            const name = `${rank}_of_${suit}`;
            fullDeck.push({
                rank,
                suit,
                name,
                imagePath: `assets/cards/${name}.png`
            });
        }
    }
}

function drawTenCards() {
    shuffle(fullDeck);
    
    const uniqueRanks = [... new Set(fullDeck.map(card => card.rank))]
    const selectedPairRank = [];

    while (selectedPairRank.length < 2) {
        const randRank = uniqueRanks[Math.floor(Math.random() * uniqueRanks.length)]
        if(!selectedPairRank.includes(randRank)){
            selectedPairRank.push(randRank);
        }
    }

    let guaranteedPairs = [];

        selectedPairRank.forEach(rank => {
            const matchingCards = fullDeck.filter(card => card.rank === rank);
            shuffle(matchingCards);
            if (matchingCards.length < 4) {
            console.warn(`Skipping rank ${rank}: Not enough cards to form a pair.`);
            return; 
        }
            guaranteedPairs.push(matchingCards[0], matchingCards[1]);
        });

        const excludedRanks = new Set(selectedPairRank);
        const remainingCards = fullDeck.filter(card => !excludedRanks.has(card.rank));
        shuffle(remainingCards);
        const fillerCards = remainingCards.slice(0, 6);

        currentDraw = [...guaranteedPairs, ...fillerCards];
        shuffle(currentDraw);

}

function shuffle(array) {
    for(let i = array.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function renderCards() {
    const board = document.getElementById("gameBoard");
    board.innerHTML = "";

    currentDraw.forEach((cards, index) => {
        const cardContainer = document.createElement("div");
       cardContainer.className = "card w-20 h-28 sm:w-24 sm:h-32 md:w-28 md:h-36 lg:w-32 lg:h-40 xl:w-36 xl:h-48 relative perspective cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out animate-draw";
        cardContainer.dataset.index = index;

        cardContainer.innerHTML = `
        <div class="card-inner w-full h-full">
        <img src="assets/cards/back.png" class="card-front" />
        <img src="${cards.imagePath}" class= "card-back" />
        </div>
        `;

        cardContainer.addEventListener("click", () => handleCardClick(cards, cardContainer));
        board.appendChild(cardContainer);
    });
}

function handleCardClick(card, cardE1) {
    if (isFlipping || cardE1.classList.contains("flipped")) return;

    cardE1.classList.add("flipped")
    selectedCards.push({ card, element: cardE1})

    if (selectedCards.length === 2) {
        isFlipping = true;
        const [first, second] = selectedCards;

        if(first.card.rank === second.card.rank){

            winningStreak++;
            updateStreakUI();
            setTimeout(() => {
                selectedCards = [];
                isFlipping = false;
                drawNextRound();
            }, 1000);
        }else{
            setTimeout(() => {
                first.element.classList.remove("flipped");
                second.element.classList.remove("flipped");
                gameOver();
            }, 1000);
        }
    }
}

function updateStreakUI() {
    document.getElementById("streakCount").innerText = winningStreak;
}

function drawNextRound() {
 setTimeout(() => {
    drawTenCards();
    renderCards();
  }, 400);
}

function gameOver() {
    alert("VadaPoochee!!!!, Game Over");
    document.querySelectorAll('.card').forEach(card => {
    card.classList.add("flipped");
    });
    winningStreak = 0;
    updateStreakUI();
    selectedCards= [];
    isFlipping = false;
    setTimeout(() => {
    drawTenCards();
    renderCards();
  }, 2000);
}

document.getElementById("restartBtn").addEventListener("click", () => {
  winningStreak = 0;
  updateStreakUI();
  generateFullDeck();
  drawTenCards();
  renderCards();
})

generateFullDeck();
drawTenCards();
renderCards();

console.log(currentDraw)