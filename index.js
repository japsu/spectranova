var minDelay = 300; // milliseconds
var maxDelay = 1000;

// some line template functions have state
var powerSaveStubCallTimes = 0;
var garbageCollectionRunning = false;

var lineTemplates = [
  function countingObjects() { return 'Counting objects: ' + randPoisson(1, 3000) + ', done.'; },

  // one log line always followed by another
  function garbageCollection() {
    if (garbageCollectionRunning) {
      return 'Garbage collection already running.';
    } else {
      setTimeout(function () {
        garbageCollectionRunning = false;
        appendLogLine('Garbage collection finished, freed ' + randPoisson(12000, 65000) + ' bytes');
      }, randPoisson(200, 3000));

      garbageCollectionRunning = true;
      return 'Started garbage collection.';
    };
  },

  function powerSaveStub() {
    powerSaveStubCallTimes += 1;
    return 'power_save: unimplemented function stub (called ' + powerSaveStubCallTimes + ' times)';
  }
];


function randInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}


// returns a random integer with a center-weighted distribution (think 3D6).
function randPoisson(min, max) {
  var rounds = 3;
  var accum = 0;

  var roundMax = (max - min) / 3;
  for (var i = 0; i < rounds; ++i) {
    accum += randInt(0, roundMax);
  }

  return accum + min;
}


function randElem(array) {
  var index = randInt(0, array.length);
  return array[index];
}


function generateLogLine() {
  var template = randElem(lineTemplates);
  return template();
}


function appendLogLine(logLine) {
  var $logLine = document.createElement('div');
  $logLine.textContent = logLine;
  document.getElementById('log').appendChild($logLine);
  $logLine.scrollIntoView();
}


function executeSingleRound() {
  appendLogLine(generateLogLine());
  scheduleNextRound();
}


function scheduleNextRound() {
  var delay = randPoisson(minDelay, maxDelay);
  setTimeout(executeSingleRound, delay);
}


document.addEventListener('DOMContentLoaded', scheduleNextRound);
