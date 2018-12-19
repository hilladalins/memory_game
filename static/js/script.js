var lulu = {}

lulu.world = ["spain", "netherlands", "jamaica", "argentina", "romania", "australia", "kenya", "italy","norway", "canada", "nigeria", "south-corea"];
lulu.rap = ["eminem", "jay-z", "kendrick-lamar", "nas", "snoop-dog", "two-pac", "cardi-b", "notorious-big", "nicki-minaj", "ice-cube", "drake", "missy-elliott"];
lulu.flowers = ["calanit", "irus", "narkis", "rakefet", "sitvanit", "tzivoni", "dvoranit", "shoshan", "turmus", "iris", "hazav", "nurit"];
lulu.easy = 12;
lulu.medium = 18;
lulu.hard = 24;

lulu.start = function () {
    lulu.board = $(".board-wrap");
    lulu.modal = $("#modal-container");
    lulu.connectButtonsEvent();
}

lulu.connectButtonsEvent = function () {
    $(".new-game-button").on("click", lulu.newGame);
    $(".play-again-button").on("click", function(){
        location.reload();
    })
};

lulu.newGame = function () {
    lulu.board.empty();
    lulu.modal.css("display", "none");
    $("audio").remove();
    $("body").removeClass();
    lulu.setDefault();
    lulu.setBoard();
    lulu.setSubject();
    lulu.connectClickToCards();
    lulu.startPlayingAudio();
};

lulu.setDefault = function () {
    lulu.level = $("#level option:selected").val()
    lulu.numberOfCards = lulu[lulu.level];
    lulu.cardsFlipped = [];
    lulu.trialsCounter = 0;
};

lulu.setBoard = function () {
    lulu.board.removeClass();
    lulu.board.addClass("board-wrap");
    var trialsCounter = $("<span/>");
    trialsCounter.addClass("trials-counter");
    trialsCounter.text(lulu.trialsCounter)
    var trials = $("<div/>");
    trials.addClass("trials");
    trials.text("Number of moves: ")
    trials.append(trialsCounter);
    var cardWrap = $("<div/>");
    cardWrap.addClass("cards-wrap");
    cardWrap.addClass(lulu.level);
    lulu.board.append(trials);
    lulu.board.append(cardWrap);
    for (var i = 0; i < lulu.numberOfCards; i++) {
        var cardContainer = $("<div/>");
        cardContainer.addClass("card-container");
        cardContainer.addClass(`${lulu.level}-card`);
        var card = $("<div/>");
        card.addClass("card");
        var cardImgBack = $("<div/>");
        cardImgBack.addClass("card-img");
        cardImgBack.addClass("back");
        cardWrap.append(cardContainer);
        cardContainer.append(card);
        card.append(cardImgBack);
    }
}

lulu.setSubject = function () {
    lulu.subject = $("#subject option:selected").val();
    lulu.setBackground();
    lulu.setBackCards();
    lulu.createArrOfImg();
    lulu.createArrayOfRandomIndexes();
    lulu.enterCardsToTheBoard();
    $(".board-wrap").css("display", "block");
    lulu.startPlayingAudio();
}

lulu.setBackground = function () {
    $("body").addClass(lulu.subject);
}

lulu.setBackCards = function () {
    $(".back").css({
        "background": `url("./img/${lulu.subject}/${lulu.subject}-back.jpg")`,
        "background-size": "cover"
    })
}

lulu.createArrOfImg = function () {
    lulu.imagesNames = []
    for (var i = 0; i < lulu.numberOfCards/2; i++) {
        lulu.imagesNames.push(lulu[lulu.subject][i]);
        lulu.imagesNames.push(lulu[lulu.subject][i]);
    }
};

lulu.createArrayOfRandomIndexes = function () {
    lulu.randomIndexesArray = [];
    for (var i = 0; i < lulu.imagesNames.length; i++) {
        lulu.createRandomIndex(i);
    }
};

lulu.createRandomIndex = function (index) {
    var num = Math.floor(Math.random() * (lulu.imagesNames.length));
    if (lulu.randomIndexesArray[num] === undefined) {
        lulu.randomIndexesArray[num] = lulu.imagesNames[index];
    }
    else {
        lulu.createRandomIndex(index);
    }
};

lulu.enterCardsToTheBoard = function () {
    var index = 0;
    $(".card").each(function () {
        var imgPath = `url(./img/${lulu.subject}/${lulu.randomIndexesArray[index]}.jpg)`
        var frontCard = $("<div/>").css({
            "background-image": imgPath,
            "background-position": "center"
        });
        frontCard.addClass("card-img");
        frontCard.addClass("is-flipped");
        $(this).append(frontCard);
        $(this).data("cardImg", lulu.randomIndexesArray[index]);
        $(this).addClass("non-matched");
        index++;
    })
};

lulu.connectClickToCards = function () {
    $(".non-matched").on("click", lulu.play);
};

lulu.startPlayingAudio = function () {
    var audio = document.createElement("audio");
    audio.id = "game-audio";
    audio.src = `./audio/${lulu.subject}.mp3`
    audio.type = "audio/mpeg";
    audio.preload = "auto";
    audio.loop = "true";
    audio.volume = 0.3;
    audio.autoplay = "true";
    document.getElementsByTagName("body")[0].appendChild(audio);
    audio.load();
};

lulu.play = function () {
    lulu.flipCard($(this));
    lulu.cardsFlipped.push($(this));
    if (lulu.cardsFlipped.length === 2) {
        lulu.checkIfCorrect();
        return;
    }
    $(this).off("click", lulu.play);
};

lulu.flipCard = function (elem) {
    elem.toggleClass("is-flipped");
};

lulu.checkIfCorrect = function () {
    $(".card").off("click", lulu.play);
    if (lulu.cardsFlipped[0].data("cardImg") !== lulu.cardsFlipped[1].data("cardImg")) {
        setTimeout(function () {
            lulu.flipCard(lulu.cardsFlipped[0]);
            lulu.flipCard(lulu.cardsFlipped[1]);
            lulu.trialsCounter++;
            $(".trials-counter").text(lulu.trialsCounter);
            lulu.cardsFlipped = [];
            lulu.connectClickToCards();
        }, 1000);
    }
    else {
        lulu.cardsFlipped[0].removeClass("non-matched");
        lulu.cardsFlipped[1].removeClass("non-matched");
        lulu.cardsFlipped[0].off("click", lulu.play);
        lulu.cardsFlipped[1].off("click", lulu.play);
        if ($(".non-matched").length === 0) {
            setTimeout(function () {
                $("#modal-container").css("display", "block");
            }, 600);
        }
        lulu.cardsFlipped = [];
        lulu.connectClickToCards();
    }

};

$(document).ready(function () {
    lulu.start();
});

