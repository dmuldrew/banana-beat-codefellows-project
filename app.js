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

function generateRow(drum, drumRow) {
  var table = document.getElementById('grid-beat');
  var row = document.createElement('tr');
  var drumName = document.createElement('td');
  drumName.className = 'drum-label';
  drumName.textContent = drum.name;
  row.appendChild(drumName);
  var beatBox;
  for (var i = 0; i < drum.playTriggers.length; i++) {
    beatBox = document.createElement('td');
    if (drum.playTriggers[i]) {
      beatBox.className = 'on';
      beatBox.style.background = randomColor();
    } else {
      beatBox.className = 'off';
      beatBox.style.background = 'none';
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
    beatBox.style.background = randomColor();
  } else {
    drum.playTriggers[beatBox.getAttribute('count-index')] = false;
    beatBox.className = 'off';
    beatBox.style.background = 'none';
  }
  resetExportCode();
}

function randomColor() {
  return 'hsl(' + (Math.random()*360) + ', 80%, 50%)';
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

// PLAY THE MUSIC

var snare = function(){
  return new Drum('snare', 'electro-flux-sound-kit/Electro Flux Sound Kit/Snares/ED Snares 01.wav');
};

var hihat = function(){
  return  new Drum('hihat', 'electro-flux-sound-kit/Electro Flux Sound Kit/Percussion (2)/ED Hit Hat Open/ED Open Hit Hat 23.wav');
};

var kick = function(){
  return  new Drum('kick', 'Samples/kick-classic.mp3');
};

var tom1 = function(){
  return  new Drum('tom1', 'Samples/tom-acoustic01.mp3');
};

var tom2 = function(){
  return  new Drum('tom2', 'Samples/tom-acoustic02.mp3');
};

var crash = function(){
  return  new Drum('crash', 'electro-flux-sound-kit/Electro Flux Sound Kit/Percussion (2)/ED Crash/ED Crash 09.wav');
};

var bass = function(){
  return  new Drum ('bass', 'random samples/Live_bass_Bitz_116.mp3');
};


var technoBass = function(){
  return  new Drum ('technoBass', '');
};

var technoKick = function(){
  return  new Drum ('technoKick', '');
};


var guitar1 = function(){
  return  new Drum ('guitar1', 'random samples/Guitar_loop32(160BPM).mp3');
};

var bassBeat = function(){
  return  new Drum ('bassBeat', 'random samples/Beat1-edited.wav');
};



var allDrums = [snare(), hihat(), kick(), tom1(), tom2(), crash(), bass()];



var d1 = document.getElementById('d1');
function switchToOption1() {
  loadDrumSetup([snare(), hihat(), kick(), tom1(), tom2(), crash(), bass()]);
}
d1.addEventListener('click', switchToOption1);

var d2 = document.getElementById('d2');
function switchToOption2() {
  loadDrumSetup([technoBass(), hihat(), technoKick(), tom1(), tom2(), crash(), bass()]);
}
d2.addEventListener('click', switchToOption2);


var d3 = document.getElementById('d3');
function switchToOption3() {
  allDrums.push(guitar1());
  loadDrumSetup (allDrums);
}
d3.addEventListener('click', switchToOption3);

var d4 = document.getElementById('d4');
function switchToOption4() {
  allDrums.push(bassBeat());
  loadDrumSetup (allDrums);
}
d4.addEventListener('click', switchToOption4);

generateTable(allDrums);

var playingInterval = setInterval(playBeat, MINUTE / (bpm * 4));

var currentBanana = 0;
var bananas = ['6.png', '7.png', '8.png', '1.png', '2.png', '3.png', '4.png', '5.png'];

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
    } else if (allBoxes[i].className != 'drum-label'){
      allBoxes[i].style.borderColor = '#1e1e1e';
    }
  }
  currentBeat++;
  currentBeat %= 16;

  document.getElementById('banana-beat').src = 'banana/banana'+bananas[currentBanana];
  currentBanana++;
  currentBanana %= 8;
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
    console.error('Unable to access localStorage:', error);
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
    generateSavedStateBox(currentState, document.getElementById('saves'));
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
  allSavedBoxes.appendChild(saveBox);

  var saveStateBox = document.createElement('div');
  saveStateBox.innerHTML = state.name + '<br/>' + state.tempo + ' bpm';
  saveBox.appendChild(saveStateBox);

  saveStateBox.addEventListener('click', function() {
    loadDrumSetup(state.setup);
    loadTempo(state.tempo);
  });

  var removeBox = document.createElement('button');
  removeBox.className = 'delete-button';
  removeBox.textContent = 'delete';
  saveBox.appendChild(removeBox);

  removeBox.addEventListener('click', function(e) {handleDeleteClick(e, state);});
}

function handleDeleteClick(e, state) {
  var saveBox = e.target.parentElement;
  saveBox.parentElement.removeChild(saveBox);

  savedStates.splice(savedStates.indexOf(state), 1);
  try {
    localStorage.savedStates = JSON.stringify(savedStates);
  } catch(error) {
    console.error('Unable to access localStorage:', error);
  }
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

// decodes a string of unicode characters to create a drum setup. uses the current set of drums to determine which drum sample and name. returns null if given invalid characters.
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

// RANDOM DRUMS

document.getElementById('random-button'). addEventListener('click', handleRandomizeClick);

function handleRandomizeClick() {
  var code = '';
  // random setup
  for (var char = 0; char < (allDrums.length * 2); char++) {
    code += String.fromCharCode(Math.round((Math.random() * 255) + 215));
  }
  // random tempo
  code += ' ' + Math.round((Math.random() * 180) + 20);

  loadDrumSetup(decode(code));
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
    row.appendChild(pianoKey);
    pianoKey.textContent = pianoLabels[i];
  }
  table.appendChild(row);
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

var firstPause = true;
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
  case 190:
    if(!firstPause) return;
    firstPause = false;
    var button = document.getElementById('play-pause');
    if (button.textContent === 'Pause') {
      clearInterval(playingInterval);
      button.textContent = 'Play';
    } else {
      playingInterval = setInterval(playBeat, MINUTE / (bpm * 4));
      button.textContent = 'Pause';
    }
    break;
  case 65:
    if(!firstKeyC) return;
    firstKeyC = false;
    c = new Note(261.63);
    c.start();
    keyA = document.getElementById('A');
    keyA.className += ' pressed';
    break;

  case 87:
    if(!firstKeyCSharp) return;
    firstKeyCSharp = false;
    cSharp = new Note(277.18);
    cSharp.start();
    keyW = document.getElementById('c-sharp');
    keyW.className += ' pressed';
    break;

  case 83:
    if(!firstKeyD) return;
    firstKeyD = false;
    d = new Note(293.66);
    d.start();
    keyS = document.getElementById('S');
    keyS.className += ' pressed';
    break;

  case 69:
    if(!firstKeyDSharp) return;
    firstKeyDSharp = false;
    dSharp = new Note(311.13);
    dSharp.start();
    keyE = document.getElementById('d-sharp');
    keyE.className += ' pressed';
    break;

  case 68:
    if(!firstKeyE) return;
    firstKeyE = false;
    e = new Note(329.63);
    e.start();
    keyD = document.getElementById('D');
    keyD.className += ' pressed';
    break;

  case 70:
    if(!firstKeyF) return;
    firstKeyF = false;
    f = new Note(349.23);
    f.start();
    keyF = document.getElementById('F');
    keyF.className += ' pressed';
    break;

  case 84:
    if(!firstKeyFSharp) return;
    firstKeyFSharp = false;
    fSharp = new Note(369.99);
    fSharp.start();
    keyT = document.getElementById('f-sharp');
    keyT.className += ' pressed';
    break;

  case 71:
    if(!firstKeyG) return;
    firstKeyG = false;
    g = new Note(392);
    g.start();
    keyG = document.getElementById('G');
    keyG.className += ' pressed';
    break;

  case 89:
    if(!firstKeyGSharp) return;
    firstKeyGSharp = false;
    gSharp = new Note(415.30);
    gSharp.start();
    keyY = document.getElementById('g-sharp');
    keyY.className += ' pressed';
    break;

  case 72:
    if(!firstKeyA) return;
    firstKeyA = false;
    a = new Note(440);
    a.start();
    keyH = document.getElementById('H');
    keyH.className += ' pressed';
    break;

  case 85:
    if(!firstKeyASharp) return;
    firstKeyASharp = false;
    aSharp = new Note(466.16);
    aSharp.start();
    keyU = document.getElementById('a-sharp');
    keyU.className += ' pressed';
    break;

  case 74:
    if(!firstKeyB) return;
    firstKeyB = false;
    b = new Note(493.88);
    b.start();
    keyJ = document.getElementById('J');
    keyJ.className += ' pressed';
    break;

  case 75:
    if(!firstKeyCNext) return;
    firstKeyCNext = false;
    cNext = new Note(523.25);
    cNext.start();
    keyK = document.getElementById('K');
    keyK.className += ' pressed';
    break;
  }
};

document.onkeyup = function(event) {
  switch (event.keyCode) {
  case 190:
    firstPause = true;
    break;
  case 65:
    firstKeyC = true;
    c.stop();
    keyA.className = keyA.className.split(' ')[0];
    break;

  case 87:
    firstKeyCSharp = true;
    cSharp.stop();
    keyW.className = keyW.className.split(' ')[0];
    break;

  case 83:
    firstKeyD = true;
    d.stop();
    keyS.className = keyS.className.split(' ')[0];
    break;

  case 69:
    firstKeyDSharp = true;
    dSharp.stop();
    keyE.className = keyE.className.split(' ')[0];
    break;

  case 68:
    firstKeyE = true;
    e.stop();
    keyD.className = keyD.className.split(' ')[0];
    break;

  case 70:
    firstKeyF = true;
    f.stop();
    keyF.className = keyF.className.split(' ')[0];
    break;

  case 84:
    firstKeyFSharp = true;
    fSharp.stop();
    keyT.className = keyT.className.split(' ')[0];
    break;

  case 71:
    firstKeyG = true;
    g.stop();
    keyG.className = keyG.className.split(' ')[0];
    break;

  case 89:
    firstKeyGSharp = true;
    gSharp.stop();
    keyY.className = keyY.className.split(' ')[0];
    break;

  case 72:
    firstKeyA = true;
    a.stop();
    keyH.className = keyH.className.split(' ')[0];
    break;

  case 85:
    firstKeyASharp = true;
    aSharp.stop();
    keyU.className = keyU.className.split(' ')[0];
    break;

  case 74:
    firstKeyB = true;
    b.stop();
    keyJ.className = keyJ.className.split(' ')[0];
    break;

  case 75:
    firstKeyCNext = true;
    cNext.stop();
    keyK.className = keyK.className.split(' ')[0];
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
      allCells[j].style.background = 'none';
    }
  }

  resetExportCode();

}
