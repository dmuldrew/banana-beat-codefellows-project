'use strict';

// GLOBALS

var MINUTE = 60000;//IT's OVER 9000!!!!(What!? 9000!?!?!)

var bpm = 80;

var currentBeat = 0;

var audioContext;
audioContext = new AudioContext || window.webkitAudioContext();

// DRUM OBJECT

function Drum(name, sample){
  this.context = audioContext;
  this.drumGain = audioContext.createGain();
  this.drumGain.gain.value = 0;
  this.name = name;
  this.sample = sample;
  this.playTriggers = new Array(16).fill(false);
  this.soundVolume = .5;
  this.muted = false;
}

Drum.prototype.playDrum = function(){
  var sound = new Audio(this.sample);
  sound.volume = this.soundVolume;
  sound.play();
  sound.muted = this.muted;
};

// TABLE GENERATION

function generateTable(drumList) {
  for(var i = 0; i < drumList.length; i++) {
    generateRow(drumList[i]);

  }
}

var sliderZIndex = 1000;

function generateRow(drum, drumRow) {
  var table = document.getElementById('grid-beat');
  var row = document.createElement('tr');
  var drumName = document.createElement('td');
  drumName.className = 'drum-label';
  drumName.innerHTML = '<span>' + drum.name + '</span>';

  var volumeDrop = document.createElement('button');
  volumeDrop.className = 'volume-drop';
  volumeDrop.style.zIndex = sliderZIndex;
  sliderZIndex--;
  volumeDrop.innerHTML = '<img src="img/volume.png" alt="volume" />';
  volumeDrop.addEventListener('click', handleClickOnVolumeBox);

  var volumeControls = document.createElement('div');
  volumeControls.id = 'volume-controls';

  var volumeSlider = document.createElement('input');
  volumeSlider.style.display = 'none';
  volumeSlider.type = 'range';
  volumeSlider.min = '0';
  volumeSlider.max = '1';
  volumeSlider.step = '.1';
  volumeSlider.value = '.5';
  volumeSlider.id = drum.name;
  volumeSlider.className = 'drum-slider';
  volumeSlider.addEventListener('change', handleVolumeChange);

  var muteButton = document.createElement('button');
  muteButton.type = 'button';
  muteButton.id = drum.name;
  muteButton.className = 'mute-button mute';
  muteButton.addEventListener('click', handleMuteButton);

  volumeDrop.appendChild(volumeSlider);
  volumeControls.appendChild(volumeDrop);
  volumeControls.appendChild(muteButton);
  drumName.appendChild(volumeControls);
  row.appendChild(drumName);

  function handleClickOnVolumeBox(){
    if (volumeSlider.style.display == 'none'){
      volumeSlider.style.display = 'inline-block';
    } else if (volumeSlider.style.display == 'inline-block'){
      volumeSlider.style.display = 'none';
    }
  }

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

// VOLUME change

function handleVolumeChange(e){
  var newVolume = e.target.value;
  for(var i = 0; i < allDrums.length; i++){
    console.log(allDrums[i].id);
    if(e.target.id == allDrums[i].name){
      allDrums[i].soundVolume = newVolume;
    }
  }
}

function handleMuteButton(e){
  for(var i = 0; i < allDrums.length; i++){
    if(e.target.id == allDrums[i].name && e.target.className.split(' ')[1] === 'mute') {
      console.log(allDrums[i].soundVolume);
      allDrums[i].muted = true;
      e.target.className = e.target.className.split(' ')[0] + ' unmute';
      e.target.style.backgroundColor = '#f43030';
    } else if(e.target.id == allDrums[i].name && e.target.className.split(' ')[1] === 'unmute') {
      allDrums[i].muted = false;
      e.target.className = e.target.className.split(' ')[0] + ' mute';
      e.target.style.backgroundColor = '#999';
    }
  }
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

  return new Drum('Snare', 'Samples/snare-acoustic01.mp3');
};

var hihat = function(){
  return  new Drum('Hi-Hat', 'Samples/hihat-dist01.mp3');
};

var kick = function(){
  return  new Drum('Kick', 'Samples/kick-classic.mp3');
};

var tom1 = function(){
  return  new Drum('Tom (1)', 'Samples/tom-acoustic01.mp3');
};

var tom2 = function(){
  return  new Drum('Tom (2)', 'Samples/tom-acoustic02.mp3');
};

var crash = function(){
  return  new Drum('Crash', 'electro-flux-sound-kit/Electro Flux Sound Kit/Percussion (2)/ED Crash/ED Crash 09.wav');
};



var goat1 = function(){
  return  new Drum ('Goat (1)', 'random samples/Goat-sound-effectedit1.mp3');
};

var goat2 = function(){
  return  new Drum ('Goat (2)', 'random samples/Goat-sound-effectedit2.mp3');
};

var goat3 = function(){
  return  new Drum ('Goat (3)', 'random samples/Goat-sound-effectiedit3.mp3');
};


var bass = function(){
  return  new Drum ('Bass', 'random samples/Live_bass_Bitz_116.mp3');
};

var bass2 = function(){
  return  new Drum ('Bass (2)', 'electro-flux-sound-kit/Electro Flux Sound Kit/Bassdrums/ED Bassdrums 33.wav');
};

var percussion1 = function(){
  return  new Drum ('ED Tom', 'electro-flux-sound-kit/Electro Flux Sound Kit/Percussion/ED Percussion 02.wav');
};

var snare2 = function(){
  return  new Drum ('ED Snare', 'electro-flux-sound-kit/Electro Flux Sound Kit/Snares/ED Snares 21.wav');
};

var percussion2 = function(){
  return  new Drum ('ED Click', 'electro-flux-sound-kit/Electro Flux Sound Kit/Synths/ED Synths 10.wav');
};

var synth1 = function(){
  return  new Drum ('ED Synth', 'electro-flux-sound-kit/Electro Flux Sound Kit/Synths/ED Synths 02.wav');
};

var crash2 = function(){
  return  new Drum ('ED Crash', 'electro-flux-sound-kit/Electro Flux Sound Kit/Percussion (2)/ED Crash/ED Crash 11.wav');
};

var guitar1 = function(){
  return  new Drum ('Guitar Loop', 'random samples/Guitar_loop32(160BPM).mp3');
};

var synthLoop = function(){
  return  new Drum ('Synth Loop', 'random samples/scifi-bass.wav');
};

var bass3 = function(){
  return  new Drum ('Bass Loop', 'random samples/Bass125A-01.mp3');
};

var bassLoop2 = function(){
  return  new Drum ('Bass Loop 2', 'random samples/EMOK1Bass86E-04.mp3');
};


var allDrums = [snare(), hihat(), kick(), tom1(), tom2(), crash()];


var d0 = document.getElementById('d0');
function switchToOption0() {
  loadDrumSetup([goat1(), goat2(), goat3(), kick(), tom1(), crash()]);
}
d0.addEventListener('click', switchToOption0);

var d1 = document.getElementById('d1');
function switchToOption1() {
  loadDrumSetup([snare(), hihat(), kick(), tom1(), tom2(), crash()]);
}
d1.addEventListener('click', switchToOption1);

var d2 = document.getElementById('d2');
function switchToOption2() {
  loadDrumSetup([bass2(), percussion1(), percussion2(), snare2(), synth1(), crash2()]);
}
d2.addEventListener('click', switchToOption2);

// adding track

var d3 = document.getElementById('d3');
function switchToOption3() {
  var index = checkForDrum(allDrums, guitar1());
  if (index < 0) {
    allDrums.push(guitar1());
    loadDrumSetup (allDrums);
  } else {
    allDrums.splice(index, 1);
    loadDrumSetup (allDrums);
  }
}
d3.addEventListener('click', switchToOption3);

var d4 = document.getElementById('d4');
function switchToOption4() {
  var index = checkForDrum(allDrums, bass());
  if (index < 0) {
    allDrums.push(bass());
    loadDrumSetup (allDrums);
  } else {
    allDrums.splice(index, 1);
    loadDrumSetup (allDrums);
  }
}
d4.addEventListener('click', switchToOption4);

var d5 = document.getElementById('d5');
function switchToOption5() {
  var index = checkForDrum(allDrums, synthLoop());
  if (index < 0) {
    allDrums.push(synthLoop());
    loadDrumSetup (allDrums);
  } else {
    allDrums.splice(index, 1);
    loadDrumSetup (allDrums);
  }
}
d5.addEventListener('click', switchToOption5);

var d6 = document.getElementById('d6');
function switchToOption6() {
  var index = checkForDrum(allDrums, bass3());
  if (index < 0) {
    allDrums.push(bass3());
    loadDrumSetup (allDrums);
  } else {
    allDrums.splice(index, 1);
    loadDrumSetup (allDrums);
  }
}
d6.addEventListener('click', switchToOption6);

var d7 = document.getElementById('d7');
function switchToOption7() {
  var index = checkForDrum(allDrums, bassLoop2());
  if (index < 0) {
    allDrums.push(bassLoop2());
    loadDrumSetup (allDrums);
  } else {
    allDrums.splice(index, 1);
    loadDrumSetup (allDrums);
  }
}
d7.addEventListener('click', switchToOption7);

// returns the index of the given drum in the given list. searches by name. returns -1 if not present.
function checkForDrum(drumList, drum) {
  for (var i = 0; i < drumList.length; i++) {
    if (drumList[i].name === drum.name) {
      return i;
    }
  }
  return -1;
}

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
      allBoxes[i].style.borderColor = '#FFDB42';
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
  var isPlaying = document.getElementById('banana-spiral').className === 'spinning';
  if (isPlaying) {
    clearInterval(playingInterval);
    playingInterval = setInterval(playBeat, MINUTE / (bpm * 4));
    var spinSpeed = 9 - (((bpm - 20) / 180) * 8);
    document.getElementById('banana-spiral').style.animationDuration = spinSpeed + 's';
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

  // current drum kit
  if (checkForDrum(drumList, goat1()) >= 0) {
    encodedList += '0';
  } else if (checkForDrum(drumList, snare()) >= 0) {
    encodedList += '1';
  } else {
    encodedList += '2';
  }

  // add ons
  if (checkForDrum(drumList, guitar1()) >= 0) {
    encodedList += '3';
  }
  if (checkForDrum(drumList, bass()) >= 0) {
    encodedList += '4';
  }
  if (checkForDrum(drumList, synthLoop()) >= 0) {
    encodedList += '5';
  }
  if (checkForDrum(drumList, bass3()) >= 0) {
    encodedList += '6';
  }
  if (checkForDrum(drumList, bassLoop2()) >= 0) {
    encodedList += '7';
  }

  encodedList += ' ';

  // encode t/f values
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
  var encodedKit = codes[0];
  var encodedList = codes[1];
  var encodedBpm = codes[2];

  if (isNaN(parseInt(encodedKit))) {
    encodedList = codes[0];
    encodedBpm = codes[1];
  } else {
    // base kit
    if (encodedKit[0] == 0) {
      switchToOption0();
    } else if (encodedKit[0] == 1) {
      switchToOption1();
    } else if (encodedKit[0] == 2) {
      switchToOption2();
    }
    // add ons
    for (var i = 1; i < encodedKit.length; i++) {
      if (encodedKit[i] == 3) {
        switchToOption3();
      }
      if (encodedKit[i] == 4) {
        switchToOption4();
      }
      if (encodedKit[i] == 5) {
        switchToOption5();
      }
      if (encodedKit[i] == 6) {
        switchToOption6();
      }
      if (encodedKit[i] == 7) {
        switchToOption7();
      }
    }
  }

  if (encodedBpm >= 20 && encodedBpm <= 200) {
    loadTempo(encodedBpm);
  }

  var binaryList = [];
  var drum = '';
  var binaryHalf, charCode;
  for (i = 0; i < encodedList.length; i++) {
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
  var volumeBox = document.createElement('div');
  volumeBox.id = 'piano-volume';
  volumeBox.textContent = 'Volume';
  table.parentElement.parentElement.insertBefore(volumeBox, table.parentElement);
  var row = document.createElement('tr');
  // row.appendChild(volumeBox);
  var pianoVolumeSlider = document.createElement('input');
  pianoVolumeSlider.type = 'range';
  pianoVolumeSlider.min = '0';
  pianoVolumeSlider.max = '1';
  pianoVolumeSlider.step = '.1';
  pianoVolumeSlider.id = 'piano-slider';
  pianoVolumeSlider.addEventListener('change', handlePianoVolumeChange);
  volumeBox.appendChild(pianoVolumeSlider);
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

var oscVolume = .5;

function handlePianoVolumeChange(e){
  oscVolume = e.target.value;
}
function Note(frequency){
  this.frequency = frequency * Math.pow(2, octave);
  this.osc = audioContext.createOscillator();
  this.osc.type = waveType;
  this.osc.frequency.value = this.frequency;
  this.gain = audioContext.createGain();
  this.gain.gain.value = oscVolume;

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
    var button = document.getElementById('banana-spiral');
    if (button.className === 'spinning') {
      clearInterval(playingInterval);
      button.className = '';
    } else {
      playingInterval = setInterval(playBeat, MINUTE / (bpm * 4));
      var spinSpeed = 9 - (((bpm - 20) / 180) * 8);
      button.style.animationDuration = spinSpeed + 's';
      button.className = 'spinning';
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

var playPauseButton = document.getElementById('playhead');
playPauseButton.addEventListener('click', handlePlayPauseClick);
function handlePlayPauseClick(e) {
  var bananaSpiral = document.getElementById('banana-spiral');
  if (e.target.id === 'playhead') {
    clearInterval(playingInterval);
    e.target.id = 'playhead-paused';
    bananaSpiral.className = '';
  } else {
    playingInterval = setInterval(playBeat, MINUTE / (bpm * 4));
    var spinSpeed = 9 - (((bpm - 20) / 180) * 8);
    bananaSpiral.style.animationDuration = spinSpeed + 's';
    e.target.id = 'playhead';
    bananaSpiral.className = 'spinning';
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
