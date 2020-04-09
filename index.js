var ipc = require('electron').ipcRenderer;
const { remote } = require('electron')
const { systemPreferences } = remote

var currentTrack = document.getElementById('track');


ipc.on('newSong', function(event, data) {
    var result = data;
    currentTrack.innerText = "♬ " + data.name + " - " + data.artist + " ♬";
});

ipc.on('current', function(event, data) {
    const isDarkMode = systemPreferences.isDarkMode();
    console.log(isDarkMode);
    var time = parseInt(data.time);
    var duration = parseInt(data.duration);
    document.body.style.background = `hsl(${time / (duration / 1000) * 360}, 87%, ${isDarkMode ? 45 : 66.67}%`
    currentTrack.style.color = isDarkMode ? '#ffffff' : '#111'
})
