//LanChat @TealDuck

const {app, BrowserWindow} = require('electron');
const ip = require("ip");
var cmd = require("node-cmd");
const publicIp = require('public-ip');

const scan = require('./network.js');
var net;

  // Keep a global reference of the window object, if you don't, the window will
  // be closed automatically when the JavaScript object is garbage collected.
  let win;

  function createWindow (url) {
    // Create the browser window.
        let {width, height} = require('electron').screen.getPrimaryDisplay().size
    		win = new BrowserWindow({
    	   	   width: 400,
   			   alwaysOnTop : false,
   			   height: height,
   			   frame: false,
   			   x: (parseInt(width)-400)
  	  	});
    if(url){
      win.loadURL('http://'+ url +':3000');
      console.log('Window  activity.js: win.window-opened at http://'+ url +':3000');
    }else{
      win.loadURL('http://localhost:3000');
      console.log('Window  activity.js: win.window-opened at http://'+ip.address()+':3000');
    }
    cmd.get("whoami",(err,data,stderr)=>{
        publicIp.v4().then(ip => {
        var a = ip;
        var b = a.split(".");
        var name = b.join("");
        if(cmd.run("ssh -o ServerAliveInterval=60 -R chat"+name+".serveo.net:443:localhost:3000 serveo.net")){
          console.log('cmd     activity.js: at https://chat'+name+'.serveo.net');
        }
        });
      });
    


    // Open the DevTools.
    //win.webContents.openDevTools();

    // Emitted when the window is closed.
    win.on('closed', () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
    
      console.log('Window  activity.js: win.closed');
      win = null;
    });
  };

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', ()=>{
  	console.log('App     activity.js: app.ready');
  	scan.network.on('netmod',function(d) {
	      if(!d) {console.log('Net     activity.js: No Server found on network.'         );require('./server.js').lanchat(createWindow);}
    else if(d) {console.log('Net     activity.js: Server found at http://'+ d +':3000/');createWindow(d);};
	});
  });

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
    	console.log('App activity.js: app.window-all-closed');
        app.quit();
    }
  });

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

  // In this file you can include the rest of your app's specific main process
  // code. You can also put them in separate files and require them here.
