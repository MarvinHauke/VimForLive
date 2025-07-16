// HJKL Navigation for Max for Live - Live Overview
// This script enables vim-style navigation in Ableton Live's overview

// Initialize the Live API
var live = new LiveAPI();

// Navigation settings
var MOVE_STEP = 1; // Number of bars/beats to move per keypress
var ZOOM_FACTOR = 2; // Factor for zooming in/out

// Current position tracking
var currentPosition = {
  time: 0,
  track: 0,
};

// Key handler function
function handleKey(key) {
  switch (key) {
    case "h":
      moveLeft();
      break;
    case "j":
      moveDown();
      break;
    case "k":
      moveUp();
      break;
    case "l":
      moveRight();
      break;
    case "H":
      moveToStart();
      break;
    case "L":
      moveToEnd();
      break;
    case "J":
      zoomOut();
      break;
    case "K":
      zoomIn();
      break;
    case "g":
      goToPosition();
      break;
    case " ":
      togglePlayback();
      break;
    default:
      post("Unknown key: " + key + "\n");
  }
}

// Movement functions
function moveLeft() {
  // For arrangement view - scroll view left
  live.path = "live_set view";
  try {
    // Try to get current visible time range
    var visibleTime = live.get("visible_time_range");
    if (visibleTime && visibleTime.length >= 2) {
      var start = visibleTime[0];
      var end = visibleTime[1];
      var duration = end - start;
      var newStart = Math.max(0, start - MOVE_STEP);
      var newEnd = newStart + duration;
      live.set("visible_time_range", [newStart, newEnd]);
      post("Scrolled left to: " + newStart + "\n");
    } else {
      // Fallback: move playhead and follow
      live.path = "live_set";
      var currentTime = live.get("current_song_time");
      var newTime = Math.max(0, currentTime - MOVE_STEP);
      live.set("current_song_time", newTime);
      post("Moved playhead left to: " + newTime + "\n");
    }
  } catch (e) {
    post("Error moving left: " + e + "\n");
  }
}

function moveRight() {
  // For arrangement view - scroll view right
  live.path = "live_set view";
  try {
    // Try to get current visible time range
    var visibleTime = live.get("visible_time_range");
    if (visibleTime && visibleTime.length >= 2) {
      var start = visibleTime[0];
      var end = visibleTime[1];
      var duration = end - start;
      var newStart = start + MOVE_STEP;
      var newEnd = newStart + duration;
      live.set("visible_time_range", [newStart, newEnd]);
      post("Scrolled right to: " + newStart + "\n");
    } else {
      // Fallback: move playhead and follow
      live.path = "live_set";
      var currentTime = live.get("current_song_time");
      var newTime = currentTime + MOVE_STEP;
      live.set("current_song_time", newTime);
      post("Moved playhead right to: " + newTime + "\n");
    }
  } catch (e) {
    post("Error moving right: " + e + "\n");
  }
}

function moveUp() {
  // Simple track navigation - just try to select tracks by index
  try {
    // Keep track of current track index
    if (typeof currentPosition.track === "undefined") {
      currentPosition.track = 0;
    }

    if (currentPosition.track > 0) {
      currentPosition.track--;
      live.path = "live_set tracks " + currentPosition.track;
      live.path = "live_set view";
      live.set("selected_track", live.path);
      post("Selected track: " + currentPosition.track + "\n");
    } else {
      post("Already at first track\n");
    }
  } catch (e) {
    post("Error selecting track up\n");
  }
}

function moveDown() {
  // Simple track navigation - just try to select tracks by index
  try {
    // Keep track of current track index
    if (typeof currentPosition.track === "undefined") {
      currentPosition.track = 0;
    }

    // Get track count
    live.path = "live_set tracks";
    var trackCount = live.children.length;

    if (currentPosition.track < trackCount - 1) {
      currentPosition.track++;
      live.path = "live_set tracks " + currentPosition.track;
      live.path = "live_set view";
      live.set("selected_track", live.path);
      post("Selected track: " + currentPosition.track + "\n");
    } else {
      post("Already at last track\n");
    }
  } catch (e) {
    post("Error selecting track down\n");
  }
}

function moveToStart() {
  live.path = "live_set";
  live.set("current_song_time", 0);
  post("Moved to start\n");
}

function moveToEnd() {
  live.path = "live_set";
  var songLength = live.get("last_event_time");
  if (songLength !== null) {
    live.set("current_song_time", songLength);
    post("Moved to end: " + songLength + "\n");
  } else {
    post("Could not get song length\n");
  }
}

// Zoom functions
function zoomIn() {
  // Try to zoom in on arrangement view
  live.path = "live_set view";
  try {
    live.call("zoom_selection");
    post("Zoomed in (selection)\n");
  } catch (e) {
    post("Zoom in not available\n");
  }
}

function zoomOut() {
  // Try to zoom out on arrangement view
  live.path = "live_set view";
  try {
    live.call("show_entire_song");
    post("Zoomed out (entire song)\n");
  } catch (e) {
    post("Zoom out not available\n");
  }
}

// Utility functions
function getTrackIndex(track) {
  // Simplified - just return 0 for now
  return 0;
}

function togglePlayback() {
  live.path = "live_set";
  var isPlaying = live.get("is_playing");
  if (isPlaying) {
    live.call("stop_playing");
    post("Stopped playback\n");
  } else {
    live.call("start_playing");
    post("Started playback\n");
  }
}

function goToPosition() {
  live.path = "live_set";
  var currentTime = live.get("current_song_time");
  if (currentTime !== null) {
    post("Current playback position: " + currentTime + "\n");
  } else {
    post("Could not get current song time\n");
  }
}

// Event listener setup (this would need to be connected to Max objects)
function setupKeyListeners() {
  // In Max for Live, you would connect this to key objects
  // or use the computer keyboard object
  post("HJKL Navigation loaded\n");
  post("Controls:\n");
  post("h - Move left\n");
  post("j - Move down (next track)\n");
  post("k - Move up (previous track)\n");
  post("l - Move right\n");
  post("H - Move to start\n");
  post("L - Move to end\n");
  post("J - Zoom out\n");
  post("K - Zoom in\n");
  post("g - Go to playback position\n");
  post("space - Toggle playback\n");
}

// Initialize
setupKeyListeners();

// Max for Live function handlers
function bang() {
  post("HJKL Navigation ready\n");
}

function msg_int(val) {
  // Convert ASCII values to characters
  var key = String.fromCharCode(val);
  handleKey(key);
}

function msg_float(val) {
  msg_int(Math.floor(val));
}

// Handle direct character input
function anything() {
  var key = messagename;
  handleKey(key);
}

// Export the main handler function
this.handleKey = handleKey;
this.bang = bang;
this.msg_int = msg_int;
this.msg_float = msg_float;
this.anything = anything;

