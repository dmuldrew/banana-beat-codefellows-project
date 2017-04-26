'use strict';

var MINUTE = 60000;//IT's OVER 9000!!!!(What!? 9000!?!?!)
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
    generateRow(allDrums[i]);
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

var technoBass = new Drum ('technoBass', '');
var technoKick = new Drum ('technoKick', '');

var allDrums = [snare, hihat, kick, tom1, tom2, crash, bass];
// var alternateDrums = [something, drum, element, that, replaces, current, elements];


var d1 = document.getElementById('d1');
function switchToOption1() {
  loadDrumSetup([snare, hihat, kick, tom1, tom2, crash, bass]);
  // nukeTable();
  // generateTable(allDrums);
  console.log('button change 1');
}
d1.addEventListener('click', switchToOption1);

var d2 = document.getElementById('d2');
function switchToOption2() {
  loadDrumSetup([technoBass, hihat, technoKick, tom1, tom2, crash, bass]);
  // nukeTable();
  // generateTable(allDrums);
  console.log('button change 2');
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
  saveBox.addEventListener('click', function() {loadDrumSetup(state.setup);});
}

function loadDrumSetup(drumList) {
  var table = document.getElementById('grid-beat');
  var newTable = document.createElement('table');
  newTable.id = 'grid-beat';
  table.parentElement.replaceChild(newTable, table);
  allDrums = copyDrumsList(drumList);
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

var audioContext = new AudioContext || window.webkitAudioContext();


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
    keyY.style.backgroundColor = 'black'
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


//creating a pause button event listener
var pause = document.getElementById('pause');
pause.addEventListener('click', pausePlaying);
function pausePlaying(){
  clearInterval(playingInterval);
}

//creating a play button event listener
var play = document.getElementById('play');
play.addEventListener('click', playBack);
function playBack(){
  playingInterval = setInterval(playBeat, MINUTE / (bpm * 4));
}

//creating a reset button
var reset = document.getElementById('reset');
reset.addEventListener('click',resetBeats);
function resetBeats(){
  var allRows = document.querySelectorAll('#grid-beat tr');
  var allCells;
  for (var i = 0; i < allDrums.length; i++) {
    allCells = allRows[i].childNodes;
    allDrums[i].playTriggers.fill(false);
    for (var j= 1; j < allCells.length; j++) {
      allCells[j].className = 'off';
    }
  }

}
