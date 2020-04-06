// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const path = require('path')
const spotify = require('spotify-node-applescript');
var now = require("performance-now");
var volume = 50;
function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 0,
    height: 0,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
   mainWindow.webContents.openDevTools()
}

  function MonitorSpotify() {
    createWindow();

    (function(){
        // do some stuff
      var execution_start_time = now();

      spotify.isRunning(function(err, isRunning){

          if(isRunning){
               spotify.getState(function(err, spotifyInstance){
                  //make sure we got state object of spotify
                  if(spotifyInstance){
                    spotify.getTrack(function(err, current_spotify_track){
                  
                      //make sure we got some track from spotify
                      if(current_spotify_track && current_spotify_track.id){                          
                          if(current_spotify_track.name == ("Advertisement") || current_spotify_track.artist == '') {
                            spotify.muteVolume();
                          } else {
                            spotify.unmuteVolume();
                            if(spotifyInstance.volume == 0) {
                              spotify.setVolume(40);
                            }
                          }
 
                      }
                      else{
                         if(err)
                             console.log("Error getting spotify track information");
                      }
                     
                    });

                  
                  }
                  else{
                    if(err)
                      
                      /*we get here when:
                          1-Turn off spotify on PC. Run on phone, change track, reopen spotify on PC. spotify shows we're playing on phone we get error here!
                          so it's a spotify thing because it's playing on multiple devices. this is continous error
                          2-When spotify is close and we just open it (while it's loading, we fail to get state and get this error). Same when we close it. this will happen
                          once and state changes to either not running or (player || paused) based on action we took.                                                    
                      */

                    console.log("Make sure spotify is running okay.");
                    //show error message                    
                  }
              });
          }
          else{
            console.log("spotify is not running");
          }
                 
      });


    var execution_end_time = now();
    //console.log("Monitor Cycle took " + (execution_end_time - execution_start_time) + " milliseconds to finish executing code.");

    setTimeout(arguments.callee, 1000);
})();

 
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(MonitorSpotify)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.

  
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
