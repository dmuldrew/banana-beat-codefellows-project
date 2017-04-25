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

function generateTable(drumList) {
  for(var i = 0; i < drumList.length; i++) {
    generateRow(drumList[i]);
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
    if (drum.playTriggers[i]) {
      beatBox.className = 'on';
      beatBox.style.background = 'blue';
    } else {
      beatBox.className = 'off';
    }
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

// retrieve saved states
var savedStates = [];

try {
  savedStates = JSON.parse(localStorage.savedStates);
} catch(error) {
  console.info('No saved states available.');
}

for (var save = 0; save < savedStates.length; save++) {
  generateSavedStateBox(savedStates[save], document.getElementById('saved-states'));
}

document.getElementById('save-form').addEventListener('submit', handleSaveSubmit);

function handleSaveSubmit(e) {
  e.preventDefault();
  saveCurrentState(e.target.nameInput.value);
  e.target.reset();
}

//saves the current state
function saveCurrentState(nameInput) {
  if(!gridIsEmpty()) {
    var currentState = {
      name: nameInput,
      setup: copyDrumsList(allDrums),
    };
    savedStates.push(currentState);
    generateSavedStateBox(currentState, document.getElementById('saved-states'));
    try {
      localStorage.savedStates = JSON.stringify(savedStates);
    } catch(error) {
      console.error('Unable to save to localStorage:', error);
    }
  }
}

// returns a new div with a saved state
function generateSavedStateBox(state, allSavedBoxes) {
  var saveBox = document.createElement('div');
  saveBox.className = 'saved-state';
  saveBox.textContent = state.name;
  allSavedBoxes.appendChild(saveBox);
  saveBox.addEventListener('click', function() {handlePreviousSaveClick(state);});
}

function handlePreviousSaveClick(state) {
  var table = document.getElementById('grid-beat');
  var newTable = document.createElement('table');
  newTable.id = 'grid-beat';
  table.parentElement.replaceChild(newTable, table);
  allDrums = copyDrumsList(state.setup);
  generateTable(allDrums);
}

// returns boolean of whether the current grid setup is empty or not
function gridIsEmpty() {
  for (var i = 0; i < allDrums.length; i++) {
    for (var j = 0; j < allDrums[i].playTriggers.length; j++) {
      if (allDrums[i].playTriggers[j]) {
        return false;
      }
    }
  }
  return true;
}

// takes a list of drums and returns an independant copy of the list
function copyDrumsList(drumList) {
  var drumListCopy = [];
  var drumCopy;
  for (var i = 0; i < drumList.length; i++) {
    drumCopy = new Drum(drumList[i].name, drumList[i].sample);
    drumCopy.playTriggers = drumList[i].playTriggers.slice();
    drumListCopy.push(drumCopy);
  }
  return drumListCopy;
}
