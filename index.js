let points = 0;
let lost = false;
let clicked = false;

function drawBox(container, row, col) {
  const box = document.createElement("div");
  $(box).addClass("box hover");
  $(box).attr("id", `box${row}${col}`);
  $(container).append(box);
}

function drawGrid(container) {
  const grid = document.createElement("div");
  $(grid).addClass("grid");

  for (let i = 0; i < 5; i++) {
    for (let z = 0; z < 5; z++) {
      drawBox(grid, i, z);
    }
  }

  $(container).append(grid);
}

function chooseBomb() {
  return (bomb =
    `${Math.floor(Math.random() * 5)}` + `${Math.floor(Math.random() * 5)}`);
}

function startUp() {
  bomb = chooseBomb();
  const game = $("#game");
  drawGrid(game);
}

startUp();

$(".box").click(function () {
  if (lost) {
    return;
  }
  let bombBox = "box" + bomb;
  $(this).removeClass("hover");
  if ($(this).attr("id") === bombBox) {
    $(this).addClass("bomb");
    $(".box").each(function () {
      if ($(this).attr("id") !== "box" + bomb) {
        $(this).addClass("opened");
      }
    });
    $("p").text("You Lost! Refresh to restart.");
    lost = true;
    playSound();
  } else if (!$(this).hasClass("opened")) {
    $(this).addClass("opened");
    points++;
    playSound();
    $("p").html(`Returns: ${calculateMultiplier()}x`);
  }
  if (points == 24) {
    $(`${bombBox}`).addClass("bomb");
    $("#game").before(
      `<h2 class="gained mb-0">You Won ${calculateMultiplier()}x! :D</h2>`
    );
    const cashoutSound = new Audio("./sounds/cashout.mp3");
    cashoutSound.play();
    clicked = true;
  }
});

function playSound() {
  if (lost) {
    const sound = new Audio("./sounds/boom.mp3");
    sound.play();
  } else if (points <= 7) {
    const sound = new Audio("./sounds/pop1.mp3");
    sound.play();
  } else if (points > 7 && points <= 15) {
    const sound = new Audio("./sounds/pop2.mp3");
    sound.play();
  } else if (points > 15) {
    const sound = new Audio("./sounds/pop3.mp3");
    sound.play();
  }
}

$(".btn-primary").on("click", function () {
  $(".box").each(function () {
    if ($(this).attr("id") !== "box" + bomb) {
      $(this).addClass("opened hover");
    } else {
      $(this).addClass("bomb");
    }
  });
  if (!lost && clicked == false) {
    $("#game").before(
      `<h2 class="gained mb-0">You gained a <strong>${calculateMultiplier()}x</strong> return!</h2>`
    );
    const cashoutSound = new Audio("./sounds/cashout.mp3");
    cashoutSound.play();
  }
  clicked = true;
});

function calculateMultiplier() {
  let probability = 1;
  for (let i = 0; i < points; i++) {
    probability *= (24 - i) / (25 - i);
  }

  const multiplier = (1 / probability) * 0.97;
  return multiplier.toFixed(2);
}
