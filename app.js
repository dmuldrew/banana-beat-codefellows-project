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


var numRows = 0;
function generateTable(allDrums) {
  for(var i = 0; i < allDrums.length; i++) {
    generateRow(allDrums[i], i);
  }
  numRows = allDrums.length;
}

function nukeTable() {
  var table = document.getElementById('grid-beat');
  for (var i = 0; i < numRows; i++) {
    var row = document.getElementById(i);
    table.removeChild(row);
  }
}

// function silenceRow(row) {
//   row.playTriggers[beatBox.getAttribute('count-index')] = false;
// }

function generateRow(drum, drumRow) {
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
  row.setAttribute('id', drumRow);
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

var snare = new Drum('snare', 'electro-flux-sound-kit/Electro Flux Sound Kit/Snares/ED Snares 01.wav');
var hihat = new Drum('hihat', 'electro-flux-sound-kit/Electro Flux Sound Kit/Percussion (2)/ED Hit Hat Open/ED Open Hit Hat 23.wav');
var kick = new Drum('kick', 'Samples/kick-classic.mp3');
var tom1 = new Drum('tom1', 'Samples/tom-acoustic01.mp3');
var tom2 = new Drum('tom2', 'Samples/tom-acoustic02.mp3');
var crash = new Drum('crash', 'electro-flux-sound-kit/Electro Flux Sound Kit/Percussion (2)/ED Crash/ED Crash 09.wav');
var bass = new Drum ('bass', 'random samples/Live_bass_Bitz_116.mp3');
var changeBUTTON = new Drum ('changeBUTTON', 'random samples/Live_bass_Bitz_116.mp3');

var allDrums = [snare, hihat, kick, tom1, tom2, crash, bass];
// var alternateDrums = [something, drum, element, that, replaces, current, elements];


var d1 = document.getElementById('d1');
function switchToOption1() {
  allDrums = [snare, hihat, kick, tom1, tom2, crash, bass];
  nukeTable();
  generateTable(allDrums);
  console.log('button change');
}
d1.addEventListener('click', switchToOption1);

var d2 = document.getElementById('d2');
function switchToOption2() {
  allDrums = [changeBUTTON, hihat, kick, tom1, tom2, crash, bass];
  nukeTable();
  generateTable(allDrums);
  console.log('button change');
}
d2.addEventListener('click', switchToOption2);


var d3 = document.getElementById('d3');
function switchToOption3() {
  allDrums = [snare, hihat, kick, tom1, tom2, crash, bass];
  //nukeRows();
  generateRow(snare, numRows);
  numRows++
  console.log('added a row');
}
d3.addEventListener('click', switchToOption3);

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
