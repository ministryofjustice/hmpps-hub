var oneOffSounds = {
    shipMissile: new Audio('/hmppsAssets/res/ship-missile.mp3'),
    saucerMissile: new Audio('/hmppsAssets/res/saucer-missile.mp3'),
    explosion1: new Audio('/hmppsAssets/res/explosion1.mp3'),
    explosion2: new Audio('/hmppsAssets/res/explosion2.mp3'),
    explosion3: new Audio('/hmppsAssets/res/explosion3.mp3'),
    thumpLow: new Audio('/hmppsAssets/res/thump-low.mp3'),
    thumpHigh: new Audio('/hmppsAssets/res/thump-high.mp3')
};

var continuousSounds = {
    largeSaucer: new Audio('/hmppsAssets/res/large-saucer.mp3'),
    smallSaucer: new Audio('/hmppsAssets/res/small-saucer.mp3')
};

function playSound(name) {
    oneOffSounds[name].play();
}

function startSound(name) {
    continuousSounds[name].loop = true;
    continuousSounds[name].play();

}

function stopSound(name) {
  if(continuousSounds[name] === undefined){
    oneOffSounds[name].pause();
  }else{
    continuousSounds[name].pause();
  }
}
