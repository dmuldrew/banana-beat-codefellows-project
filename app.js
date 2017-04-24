'use strict';

function Drum(name, sample){
  this.name = name;
  this.sample = sample;//new Audio(sample);
  this.playTriggers = [];
  this.playTriggers.length = 16;
  this.playTriggers.fill(false);

}

function playDrum (drum) {
  new Audio(drum.sample).play();
}

var snare = new Drum('snare', 'Samples/snare-big.mp3');
var hihat = new Drum('hihat', 'Samples/hihat-808.mp3');
// playDrum(snare);
snare.playTriggers[1] = true;
snare.playTriggers[2] = true;
hihat.playTriggers[5] = true;
hihat.playTriggers[7] = true;
snare.playTriggers[9] = true;
snare.playTriggers[11] = true;
hihat.playTriggers[13] = true;
hihat.playTriggers[15] = true;

var interval = 4000/16;
setInterval(function() {playMeasure(snare);}, 4000);
setInterval(function() {playMeasure(hihat);}, 4000);


function playMeasure (drum){
  for (var i = 0; i < drum.playTriggers.length; i++){
    if (drum.playTriggers[i]){
      setTimeout(function() {playDrum(drum);}, i * interval);
      setTimeout(function() {console.log(drum.name);}, i * interval);
    }
  }
}
