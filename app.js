'use strict';


var bpm = 90;
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

var snare = new Drum('snare', 'Samples/snare-dist01.mp3');
var hihat = new Drum('hihat', 'Samples/hihat-dist01.mp3');
var kick = new Drum('kick', 'Samples/kick-classic.mp3');
var tom1 = new Drum('tom1', 'Samples/tom-acoustic01.mp3');
var tom2 = new Drum('tom2', 'Samples/tom-acoustic02.mp3');
var crash = new Drum('crash', 'Samples/crash-acoustic.mp3');


var allDrums = [snare, hihat, kick, tom1, tom2, crash];

generateTable(allDrums);

setInterval(playBeat, 6000 / bpm);

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
    row.appendChild(pianoKey);
  }
  table.appendChild(row);
}
generatePiano();

var key;
document.onkeydown = function(e) {
  switch (e.keyCode) {
  case 65:
    key = 'A';
    break;
  }
};


var a = new Audio('Samples/clap-808.mp3');
if (key == 'A'){
  a.play();
}
