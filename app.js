'use strict';

var MINUTE = 6000;
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
    beatBox.style.background = 'blue';
    beatBox.className = 'on';
  } else {
    drum.playTriggers[beatBox.getAttribute('count-index')] = false;
    beatBox.style.background = 'transparent';
    beatBox.className = 'off';
  }
}

// set the default values of the slider and text to current bpm
var tempoValue = document.getElementById('tempo-value');
tempoValue.textContent = bpm + ' bpm';
var tempoSlider = document.querySelector('#tempo-form input');
tempoSlider.value = bpm;
// set up form to change the bpm
var tempoForm = document.getElementById('tempo-form');
tempoForm.addEventListener('submit', handleTempoSubmit);

function handleTempoSubmit(e) {
  e.preventDefault();
  // change the global bpm
  bpm = e.target.tempo.value;
  tempoValue.textContent = bpm + ' bpm';
  // activate the change in tempo
  clearInterval(playingInterval);
  playingInterval = setInterval(playBeat, MINUTE / bpm);
}

var snare = new Drum('snare', 'Samples/snare-dist01.mp3');
var hihat = new Drum('hihat', 'Samples/hihat-dist01.mp3');
var kick = new Drum('kick', 'Samples/kick-classic.mp3');
var tom1 = new Drum('tom1', 'Samples/tom-acoustic01.mp3');
var tom2 = new Drum('tom2', 'Samples/tom-acoustic02.mp3');
var crash = new Drum('crash', 'Samples/crash-acoustic.mp3');


var allDrums = [snare, hihat, kick, tom1, tom2, crash];

generateTable(allDrums);

var playingInterval = setInterval(playBeat, MINUTE / bpm);

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
