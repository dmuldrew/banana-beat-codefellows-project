'use strict';

// GLOBALS

var MINUTE = 60000;//IT's OVER 9000!!!!(What!? 9000!?!?!)

var bpm = 80;

var currentBeat = 0;

// DRUM OBJECT

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
// function generateTable(drumList) {
//   for(var i = 0; i < drumList.length; i++) {
//     generateRow(drumList[i]);
//
//   }
//   numRows = allDrums.length;
// }

// function nukeTable() {
//   var table = document.getElementById('grid-beat');
//   for (var i = 0; i < numRows; i++) {
//     var row = document.getElementById(i);
//     table.removeChild(row);
//   }
// }

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
    console.log(drum.playTriggers[i]);
    if (drum.playTriggers[i]) {
      beatBox.className = 'on';
    } else {
      beatBox.className = 'off';
    }
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
    beatBox.className = 'on';
  } else {
    drum.playTriggers[beatBox.getAttribute('count-index')] = false;
    beatBox.className = 'off';
  }
  resetExportCode();
}

// TEMPO CHANGE FUNCTIONALITY

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
  loadTempo(newBpm);
  resetExportCode();
}

var snare = function(){
  return new Drum('snare', 'Samples/snare-acoustic01.mp3');
}

var hihat = function(){
  return  new Drum('hihat', 'Samples/hihat-dist01.mp3');
}

var kick = function(){
  return  new Drum('kick', 'Samples/kick-classic.mp3');
}

var tom1 = function(){
  return  new Drum('tom1', 'Samples/tom-acoustic01.mp3');
}

var tom2 = function(){
  return  new Drum('tom2', 'Samples/tom-acoustic02.mp3');
}

var crash = function(){
  return  new Drum('crash', 'electro-flux-sound-kit/Electro Flux Sound Kit/Percussion (2)/ED Crash/ED Crash 09.wav');
}



var goat1 = function(){
  return  new Drum ('goat 1', 'random samples/Goat-sound-effectedit1.mp3');
}

var goat2 = function(){
  return  new Drum ('goat 2', 'random samples/Goat-sound-effectedit2.mp3');
}

var goat3 = function(){
  return  new Drum ('goat 3', 'random samples/Goat-sound-effectiedit3.mp3');
}


var bass = function(){
  return  new Drum ('bass', 'random samples/Live_bass_Bitz_116.mp3');
}

var bass2 = function(){
  return  new Drum ('bass 2', 'electro-flux-sound-kit/Electro Flux Sound Kit/Bassdrums/ED Bassdrums 33.wav');
}

var percussion1 = function(){
  return  new Drum ('percussion 1', 'electro-flux-sound-kit/Electro Flux Sound Kit/Percussion/ED Percussion 02.wav');
}

var snare2 = function(){
  return  new Drum ('snare 2', 'electro-flux-sound-kit/Electro Flux Sound Kit/Snares/ED Snares 21.wav');
}

var percussion2 = function(){
  return  new Drum ('percussion2', 'electro-flux-sound-kit/Electro Flux Sound Kit/Synths/ED Synths 10.wav');
}

var synth1 = function(){
  return  new Drum ('synth1', 'electro-flux-sound-kit/Electro Flux Sound Kit/Synths/ED Synths 02.wav');
}

var crash2 = function(){
  return  new Drum ('crash 2', 'electro-flux-sound-kit/Electro Flux Sound Kit/Percussion (2)/ED Crash/ED Crash 11.wav');
}

var guitar1 = function(){
  return  new Drum ('guitar loop (40bpm)', 'random samples/Guitar_loop32(160BPM).mp3');
}

var synthLoop = function(){
  return  new Drum ('synth loop (60bpm)', 'random samples/scifi-bass.wav');
}

var bass3 = function(){
  return  new Drum ('bass loop (60bpm)', 'random samples/Bass125A-01.mp3');
}

var bassLoop2 = function(){
  return  new Drum ('bass loop 2 (43bpm)', 'random samples/EMOK1Bass86E-04.mp3');
}

var allDrums = [snare(), hihat(), kick(), tom1(), tom2(), crash()];
// var alternateDrums = [something, drum, element, that, replaces, current, elements];


var d0 = document.getElementById('d0');
function switchToOption0() {
  loadDrumSetup([goat1(), goat2(), goat3(), kick(), tom1(), crash()]);
  // nukeTable();
  // generateTable(allDrums);
  console.log('button change 0');
}
d0.addEventListener('click', switchToOption0);

var d1 = document.getElementById('d1');
function switchToOption1() {
  loadDrumSetup([snare(), hihat(), kick(), tom1(), tom2(), crash()]);
  // nukeTable();
  // generateTable(allDrums);
  console.log('button change 1');
}
d1.addEventListener('click', switchToOption1);

var d2 = document.getElementById('d2');
function switchToOption2() {
  loadDrumSetup([bass2(), percussion1(), percussion2(), snare2(), synth1(), crash2()]);
  // nukeTable();
  // generateTable(allDrums);
  console.log('button change 2');
}
d2.addEventListener('click', switchToOption2);


var d3 = document.getElementById('d3');
function switchToOption3() {
  allDrums.push(guitar1());
  loadDrumSetup (allDrums);
  console.log('added a row');
}
d3.addEventListener('click', switchToOption3);

var d4 = document.getElementById('d4');
function switchToOption4() {
  allDrums.push(bass());
  loadDrumSetup (allDrums);
  console.log('added a row');
}
d4.addEventListener('click', switchToOption4);

var d5 = document.getElementById('d5');
function switchToOption5() {
  allDrums.push(synthLoop());
  loadDrumSetup (allDrums);
  console.log('added a row');
}
d5.addEventListener('click', switchToOption5);

var d6 = document.getElementById('d6');
function switchToOption6() {
  allDrums.push(bass3());
  loadDrumSetup (allDrums);
  console.log('added a row');
}
d6.addEventListener('click', switchToOption6);

var d7 = document.getElementById('d7');
function switchToOption7() {
  allDrums.push(bassLoop2());
  loadDrumSetup (allDrums);
  console.log('added a row');
}
d7.addEventListener('click', switchToOption7);


generateTable(allDrums);

var playingInterval = setInterval(playBeat, MINUTE / (bpm * 4));

function playBeat(){
  for (var i = 0; i < allDrums.length; i++){
    if (allDrums[i].playTriggers[currentBeat]){
      allDrums[i].playDrum();
    }
  }
  var allBoxes = document.querySelectorAll('#grid-beat td');
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

// SAVING TO LOCALSTORAGE FUNCTIONALITY

// retrieve saved states
var savedStates = [];

try {
  savedStates = JSON.parse(localStorage.savedStates);
} catch(error) {
  console.info('No saved states available.');
}

for (var save = 0; save < savedStates.length; save++) {
  generateSavedStateBox(savedStates[save], document.getElementById('saves'));
}

document.getElementById('save-form').addEventListener('submit', handleSaveSubmit);

document.getElementById('clear-saves').addEventListener('click', handleClearClick);

function handleSaveSubmit(e) {
  e.preventDefault();
  saveCurrentState(e.target.nameInput.value);
  e.target.reset();
}

function handleClearClick() {
  try {
    localStorage.clear();
    document.getElementById('saves').innerHTML = '';
  } catch(error) {
    console.error('Unable to save to localStorage:', error);
  }
}

//saves the current state
function saveCurrentState(nameInput) {
  if(!gridIsEmpty()) {
    var currentState = {
      name: nameInput,
      setup: copyDrumsList(allDrums),
      tempo: bpm,
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

  saveBox.addEventListener('click', function() {
    loadDrumSetup(state.setup);
    loadTempo(state.tempo);
  });
}

// takes a list of drums as a drum setup and loads it to the grid
function loadDrumSetup(drumList) {
  var table = document.getElementById('grid-beat');
  // table.textContent = '';
  var newTable = document.createElement('table');
  newTable.id = 'grid-beat';
  table.parentElement.replaceChild(newTable, table);

  allDrums = [];

  allDrums = copyDrumsList(drumList);
  generateTable(allDrums);

  resetExportCode();
}

function loadTempo(tempo) {
  bpm = tempo;
  tempoSlider.value = bpm;
  tempoValue.value = bpm;
  var isPlaying = document.getElementById('play-pause').textContent === 'Pause';
  if (isPlaying) {
    clearInterval(playingInterval);
    playingInterval = setInterval(playBeat, MINUTE / (bpm * 4));
  }
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

// EXPORT/IMPORT FUNCTIONALITY

document.getElementById('export-form').addEventListener('submit', handleExportSubmit);

document.getElementById('import-form').addEventListener('submit', handleImportSubmit);

function handleExportSubmit(e) {
  e.preventDefault();
  e.target.exportOutput.value = encode(allDrums);
  e.target.exportOutput.select();
}

function handleImportSubmit(e) {
  e.preventDefault();
  var importedDrums = decode(e.target.importInput.value);
  var errorBox = document.getElementById('error-message');
  if (importedDrums) {
    loadDrumSetup(importedDrums);
    errorBox.textContent = '';
  } else {
    errorBox.textContent = 'Please enter a valid code.';
  }
  e.target.reset();
}

function resetExportCode() {
  document.querySelector('#export-form input').value = '';
}

// encodes the current set of drums as a string of unicode characters
function encode(drumList) {
  var encodedList = '';
  var binaryString, charOne, charTwo;
  for (var i = 0; i < drumList.length; i++) {
    binaryString = '';
    for (var j = 0; j < drumList[i].playTriggers.length; j++) {
      if (drumList[i].playTriggers[j]) {
        binaryString += '1';
      } else {
        binaryString += '0';
      }
    }
    charOne = binaryString.slice(0,8); // fist byte
    charOne = String.fromCharCode(parseInt(charOne, 2) + 215); // default ×
    charTwo = binaryString.slice(8); // second byte
    charTwo = String.fromCharCode(parseInt(charTwo, 2) + 215); // default ×
    encodedList += charOne + charTwo;
  }
  encodedList += ' ' + bpm;
  return encodedList;
}

// decodes a string of unicode characters to create a drum setup. uses the current set of drums to determine which the drum sample and name. returns null if given invalid characters.
function decode(code) {
  var codes = code.split(' ');
  var encodedList = codes[0];
  var encodedBpm = codes[1];

  if (encodedBpm >= 20 && encodedBpm <= 200) {
    loadTempo(encodedBpm);
  }

  var binaryList = [];
  var drum = '';
  var binaryHalf, charCode;
  for (var i = 0; i < encodedList.length; i++) {
    binaryHalf = '';
    charCode = encodedList.charCodeAt(i) - 215; // reset default to 0
    if (charCode < 0) {
      return null;
    }
    binaryHalf += charCode.toString(2);
    while (binaryHalf.length < 8) {
      binaryHalf = '0' + binaryHalf;
    }
    drum += binaryHalf;
    if (i % 2) {
      if (binaryList.length > 16) {
        return null;
      }
      binaryList.push(drum);
      drum = '';
    }
  }

  var drumList = copyDrumsList(allDrums);

  for (i = 0; i < binaryList.length; i++) {
    drumList[i].playTriggers = [];
    for (var j = 0; j < binaryList[i].length; j++) {
      if (parseInt(binaryList[i][j])) {
        drumList[i].playTriggers.push(true);
      } else {
        drumList[i].playTriggers.push(false);
      }
    }
  }
  return drumList;
}

// PIANO FUNCTIONALITY

var pianoLabels = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K'];

function generatePiano() {
  var table = document.getElementById('piano');
  var row = document.createElement('tr');
  var pianoKey;
  for (var i = 0; i < pianoLabels.length; i++) {
    pianoKey = document.createElement('td');
    pianoKey.setAttribute('id', pianoLabels[i]);
    pianoKey.style.width = '35px';
    pianoKey.style.height = '150px';
    row.appendChild(pianoKey);
  }
  table.appendChild(row);
  var blackKey = document.getElementById('blackKey');
}
generatePiano();

var audioContext;
audioContext = new AudioContext || window.webkitAudioContext();

var octave = 0;
var octaveChange = document.getElementById('octave-menu');

function handleOctaveChange(e){
  octave = e.target.value - 4;
}
octaveChange.addEventListener('change', handleOctaveChange);


var waveType = 'sine';
var waveChange = document.getElementById('wave-menu');

function handleWaveChange(e){
  waveType = e.target.value;
}

waveChange.addEventListener('change', handleWaveChange);


function Note(frequency){
  this.frequency = frequency * Math.pow(2, octave);
  this.osc = audioContext.createOscillator();
  this.osc.type = waveType;
  this.osc.frequency.value = this.frequency;
  this.gain = audioContext.createGain();
  this.gain.gain.value = .5;

  this.osc.connect(this.gain);
  this.gain.connect(audioContext.destination);

}

Note.prototype.start = function () {
  this.osc.start(0);

};

Note.prototype.stop = function() {
  this.gain.gain.setTargetAtTime(0, audioContext.currentTime, 0.015);
};

var c, cSharp, d, dSharp, e, f, fSharp, g, gSharp, a, aSharp, b, cNext;
var keyA, keyW, keyS, keyE, keyD, keyF, keyT, keyG, keyY, keyH, keyU, keyJ, keyK;

var firstKeyA = true;
var firstKeyB = true;
var firstKeyC = true;
var firstKeyD = true;
var firstKeyE = true;
var firstKeyF = true;
var firstKeyG = true;
var firstKeyCSharp = true;
var firstKeyDSharp = true;
var firstKeyFSharp = true;
var firstKeyGSharp = true;
var firstKeyASharp = true;
var firstKeyCNext = true;

document.onkeydown = function(event) {
  switch (event.keyCode) {
  case 65:
    if(!firstKeyC) return;
    firstKeyC = false;
    c = new Note(261.63);
    c.start();
    keyA = document.getElementById('A');
    keyA.style.backgroundColor = 'red';
    break;

  case 87:
    if(!firstKeyCSharp) return;
    firstKeyCSharp = false;
    cSharp = new Note(277.18);
    cSharp.start();
    keyW = document.getElementById('c-sharp');
    keyW.style.backgroundColor = 'red';
    break;

  case 83:
    if(!firstKeyD) return;
    firstKeyD = false;
    d = new Note(293.66);
    d.start();
    keyS = document.getElementById('S');
    keyS.style.backgroundColor = 'red';
    break;

  case 69:
    if(!firstKeyDSharp) return;
    firstKeyDSharp = false;
    dSharp = new Note(311.13);
    dSharp.start();
    keyE = document.getElementById('d-sharp');
    keyE.style.backgroundColor = 'red';
    break;

  case 68:
    if(!firstKeyE) return;
    firstKeyE = false;
    e = new Note(329.63);
    e.start();
    keyD = document.getElementById('D');
    keyD.style.backgroundColor = 'red';
    break;

  case 70:
    if(!firstKeyF) return;
    firstKeyF = false;
    f = new Note(349.23);
    f.start();
    keyF = document.getElementById('F');
    keyF.style.backgroundColor = 'red';
    break;

  case 84:
    if(!firstKeyFSharp) return;
    firstKeyFSharp = false;
    fSharp = new Note(369.99);
    fSharp.start();
    keyT = document.getElementById('f-sharp');
    keyT.style.backgroundColor = 'red';
    break;

  case 71:
    if(!firstKeyG) return;
    firstKeyG = false;
    g = new Note(392);
    g.start();
    keyG = document.getElementById('G');
    keyG.style.backgroundColor = 'red';
    break;

  case 89:
    if(!firstKeyGSharp) return;
    firstKeyGSharp = false;
    gSharp = new Note(415.30);
    gSharp.start();
    keyY = document.getElementById('g-sharp');
    keyY.style.backgroundColor = 'red';
    break;

  case 72:
    if(!firstKeyA) return;
    firstKeyA = false;
    a = new Note(440);
    a.start();
    keyH = document.getElementById('H');
    keyH.style.backgroundColor = 'red';
    break;

  case 85:
    if(!firstKeyASharp) return;
    firstKeyASharp = false;
    aSharp = new Note(466.16);
    aSharp.start();
    keyU = document.getElementById('a-sharp');
    keyU.style.backgroundColor = 'red';
    break;

  case 74:
    if(!firstKeyB) return;
    firstKeyB = false;
    b = new Note(493.88);
    b.start();
    keyJ = document.getElementById('J');
    keyJ.style.backgroundColor = 'red';
    break;

  case 75:
    if(!firstKeyCNext) return;
    firstKeyCNext = false;
    cNext = new Note(523.25);
    cNext.start();
    keyK = document.getElementById('K');
    keyK.style.backgroundColor = 'red';
    break;
  }
};

document.onkeyup = function(event) {
  switch (event.keyCode) {
  case 65:
    firstKeyC = true;
    c.stop();
    keyA.style.backgroundColor = 'white';
    break;

  case 87:
    firstKeyCSharp = true;
    cSharp.stop();
    keyW.style.backgroundColor = 'black';
    break;

  case 83:
    firstKeyD = true;
    d.stop();
    keyS.style.backgroundColor = 'white';
    break;

  case 69:
    firstKeyDSharp = true;
    dSharp.stop();
    keyE.style.backgroundColor = 'black';
    break;

  case 68:
    firstKeyE = true;
    e.stop();
    keyD.style.backgroundColor = 'white';
    break;

  case 70:
    firstKeyF = true;
    f.stop();
    keyF.style.backgroundColor = 'white';
    break;

  case 84:
    firstKeyFSharp = true;
    fSharp.stop();
    keyT.style.backgroundColor = 'black';
    break;

  case 71:
    firstKeyG = true;
    g.stop();
    keyG.style.backgroundColor = 'white';
    break;

  case 89:
    firstKeyGSharp = true;
    gSharp.stop();
    keyY.style.backgroundColor = 'black';
    break;

  case 72:
    firstKeyA = true;
    a.stop();
    keyH.style.backgroundColor = 'white';
    break;

  case 85:
    firstKeyASharp = true;
    aSharp.stop();
    keyU.style.backgroundColor = 'black';
    break;

  case 74:
    firstKeyB = true;
    b.stop();
    keyJ.style.backgroundColor = 'white';
    break;

  case 75:
    firstKeyCNext = true;
    cNext.stop();
    keyK.style.backgroundColor = 'white';
    break;
  }
};

// PLAY, PAUSE, RESET FUNCTIONALITY

var playPauseButton = document.getElementById('play-pause');
playPauseButton.addEventListener('click', handlePlayPauseClick);
function handlePlayPauseClick(e) {
  var button = e.target;
  if (button.textContent === 'Pause') {
    clearInterval(playingInterval);
    button.textContent = 'Play';
  } else {
    playingInterval = setInterval(playBeat, MINUTE / (bpm * 4));
    button.textContent = 'Pause';
  }
}


// //creating a pause button event listener
// var pause = document.getElementById('pause');
// pause.addEventListener('click', pausePlaying);
// function pausePlaying(){
//   clearInterval(playingInterval);
// }
//
// //creating a play button event listener
// var play = document.getElementById('play');
// play.addEventListener('click', playBack);
// function playBack(){
//   playingInterval = setInterval(playBeat, MINUTE / (bpm * 4));
// }

//creating a reset button
var reset = document.getElementById('reset');
reset.addEventListener('click',resetBeats);
function resetBeats(){
  var allRows = document.querySelectorAll('#grid-beat tr');
  var allCells;
  for (var i = 0; i < allDrums.length; i++) {
    allDrums[i].playTriggers.fill(false);
    allCells = allRows[i].childNodes;
    for (var j= 1; j < allCells.length; j++) {
      allCells[j].className = 'off';
    }
  }

  resetExportCode();

}
