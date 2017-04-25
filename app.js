'use strict';

var MINUTE = 60000;
var bpm = 80;

var currentBeat = 0;

function Drum(name, sample){
  this.name = name;
  this.sample = sample;
  this.playTriggers = new Array(16).fill(false);
}

Drum.prototype.playDrum = function(){
  new Audio(this.sample).play();
};

function generateTable(allDrums) {
  for(var i = 0; i < allDrums.length; i++) {
    generateRow(allDrums[i]);
  }
}

function generateRow(drum) {
  var table = document.getElementById('grid-beat');
  var row = document.createElement('tr');
  var drumName = document.createElement('td');
  drumName.textContent = drum.name;
  row.appendChild(drumName);
  var beatBox;
  for (var i = 0; i < drum.playTriggers.length; i++) {
    beatBox = document.createElement('td');
    beatBox.className = 'off';
    beatBox.setAttribute('count-index', i);
    row.appendChild(beatBox);
    beatBox.addEventListener('click', function(e) {toggleTrigger(e, drum);});
  }
  table.appendChild(row);
}

function toggleTrigger(e, drum) {
  var beatBox = e.target;
  if (beatBox.className === 'off') {
    drum.playTriggers[beatBox.getAttribute('count-index')] = true;
    beatBox.style.background = 'red';
    beatBox.className = 'on';
  } else {
    drum.playTriggers[beatBox.getAttribute('count-index')] = false;
    beatBox.style.background = 'transparent';
    beatBox.className = 'off';
  }
}

// set the default values of the slider and text to current bpm
var tempoValue = document.getElementById('tempo-value');
tempoValue.value = bpm;
var tempoSlider = document.getElementById('tempo-slider');
tempoSlider.value = bpm;
// listen for a change to the bpm
tempoValue.addEventListener('change', handleTempoChange);
tempoSlider.addEventListener('change', handleTempoChange);

function handleTempoChange(e) {
  var newBpm = Math.round(e.target.value);
  if (newBpm < 20) {
    newBpm = 20;
  } else if(newBpm > 200) {
    newBpm = 200;
  }
  // change the global bpm
  bpm = newBpm;
  tempoSlider.value = bpm;
  tempoValue.value = bpm;
  // activate the change in tempo
  clearInterval(playingInterval);
  playingInterval = setInterval(playBeat, MINUTE / (bpm * 4));
}

var snare = new Drum('snare', 'Samples/snare-dist01.mp3');
var hihat = new Drum('hihat', 'Samples/hihat-dist01.mp3');
var kick = new Drum('kick', 'Samples/kick-classic.mp3');
var tom1 = new Drum('tom1', 'Samples/tom-acoustic01.mp3');
var tom2 = new Drum('tom2', 'Samples/tom-acoustic02.mp3');
var crash = new Drum('crash', 'Samples/crash-acoustic.mp3');


var allDrums = [snare, hihat, kick, tom1, tom2, crash];

generateTable(allDrums);

var playingInterval = setInterval(playBeat, MINUTE / (bpm * 4));

function playBeat(){
  for (var i = 0; i < allDrums.length; i++){
    if (allDrums[i].playTriggers[currentBeat]){
      allDrums[i].playDrum();
    }
  }
  var allBoxes = document.getElementsByTagName('td');
  for (i = 0; i < allBoxes.length; i++) {
    if (allBoxes[i].getAttribute('count-index') == currentBeat) {
      allBoxes[i].style.borderColor = 'red';
    } else {
      allBoxes[i].style.borderColor = 'black';
    }
  }
  currentBeat++;
  currentBeat %= 16;
}

var pianoLabels = ['A', 'S', 'D', 'F', 'G', 'H', 'J'];
function generatePiano() {
  var table = document.getElementById('piano');
  var row = document.createElement('tr');
  var pianoKey;
  for (var i = 0; i < pianoLabels.length; i++) {
    pianoKey = document.createElement('td');
    pianoKey.textContent = pianoLabels[i];
    pianoKey.style.width = '35px';
    pianoKey.style.height = '150px';
    row.appendChild(pianoKey);
  }
  table.appendChild(row);
}
generatePiano();




var audioContext, osc, gain;
audioContext = new AudioContext || window.webkitAudioContext();

function Note(frequency){
  this.frequency = frequency;
  this.oscs = [];
}

Note.prototype.play = function () {
  osc = audioContext.createOscillator();
  osc.type = 'sine';
  osc.frequency.value = this.frequency;

  gain = audioContext.createGain();
  gain.gain.value = .5;

  osc.connect(gain);
  gain.connect(audioContext.destination);

  osc.start(0);

  this.oscs.push(osc);
};


document.onkeydown = function(event) {

  switch (event.keyCode) {
    case 65:
    var c = new Note(261.63);
    c.play();
    break;
    case 83:
    var d = new Note(293.66);
    d.play();
    break;
    case 68:
    gain.gain.value = 1;
    osc.frequency.value = 329.63;
    setTimeout(function(){gain.gain.value = 0;}, 250);
    break;
    case 70:
    gain.gain.value = 1;
    osc.frequency.value = 349.23;
    setTimeout(function(){gain.gain.value = 0;}, 250);
    break;
    case 71:
    gain.gain.value = 1;
    osc.frequency.value = 392.00;
    setTimeout(function(){gain.gain.value = 0;}, 250);
    break;
    case 72:
    gain.gain.value = 1;
    osc.frequency.value = 440;
    setTimeout(function(){gain.gain.value = 0;}, 250);
    break;
    case 74:
    gain.gain.value = 1;
    osc.frequency.value = 493.88;
    setTimeout(function(){gain.gain.value = 0;}, 250);
    break;
  }
};
