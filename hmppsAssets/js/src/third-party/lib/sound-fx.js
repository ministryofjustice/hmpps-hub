var oneOffSounds = {
    shipMissile: new Audio('./res/ship-missile.mp3'),
    saucerMissile: new Audio('./res/saucer-missile.mp3'),
    explosion1: new Audio('./res/explosion1.mp3'),
    explosion2: new Audio('./res/explosion2.mp3'),
    explosion3: new Audio('./res/explosion3.mp3'),
    thumpLow: new Audio('./res/thump-low.mp3'),
    thumpHigh: new Audio('./res/thump-high.mp3')
};

var continuousSounds = {
    largeSaucer: new Audio('./res/large-saucer.mp3'),
    smallSaucer: new Audio('./res/small-saucer.mp3')
};

function playSound(name) {
    oneOffSounds[name].play();
}

function startSound(name) {
    continuousSounds[name].loop = true;
    continuousSounds[name].play();
}

function stopSound(name) {
    continuousSounds[name].pause();
}