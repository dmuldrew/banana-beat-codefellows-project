'use strict';

function Drum(name, sample){
  this.name = name;
  this.sample = new Audio(sample);
  this.playTriggers = [];
  this.playTriggers.length = 16;
  this.playTriggers.fill(false);

}

function playDrum (drum) {
  drum.sample.play();
  // console.log('play!');
}

var snare = new Drum('snare', 'Samples/snare-big.mp3');

// playDrum(snare);

var interval = setInterval(function() {playDrum(snare);}, 1000);
