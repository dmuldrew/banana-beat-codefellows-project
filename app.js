'use strict';


var bpm = 10;
var currentBeat = 0;

function Drum(name, sample){
  this.name = name;
  this.sample = sample;
  this.playTriggers = new Array(16).fill(false);

}

Drum.prototype.playDrum = function(){
  new Audio(this.sample).play();
};

var snare = new Drum('snare', 'Samples/snare-big.mp3');
var hihat = new Drum('hihat', 'Samples/hihat-808.mp3');

var allDrums = [snare, hihat];

snare.playTriggers[1] = true;
snare.playTriggers[2] = true;
hihat.playTriggers[5] = true;
hihat.playTriggers[7] = true;
snare.playTriggers[9] = true;
snare.playTriggers[11] = true;
hihat.playTriggers[13] = true;
hihat.playTriggers[15] = true;


setInterval(playBeat, 6000 / bpm);

function playBeat(){
  for (var i = 0; i < allDrums.length; i++){
    if (allDrums[i].playTriggers[currentBeat]){
      allDrums[i].playDrum();
    }
  }
  currentBeat++;
  currentBeat %= 16;
}
