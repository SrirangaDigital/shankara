const {
    app, BrowserWindow
} = require('electron')

require('electron-context-menu')({
    prepend: (params, browserWindow) => [{
        label: 'Rainbow',
        // Only show it when right-clicking images
        visible: params.mediaType === 'image'
    }]
});

let win;

function createWindow() {

    // Instantiate Express App
    app.server = require(__dirname + '/server')();

    let splashScreen = new BrowserWindow({
        width: 162,
        height: 162,
        frame: false,
        icon: __dirname + '/dist/assets/img/icon.png',
        title: "Shankara Granthavali"
    });
    splashScreen.loadURL(`file://${__dirname}/dist/assets/html/splash.html`)
    splashScreen.show();

    // Create the browser window.
    win = new BrowserWindow({ 
    
        show: false,
        icon: __dirname + '/dist/assets/img/icon.png',
        title: "Shankara Granthavali"
    });

    win.loadURL(`file://${__dirname}/dist/index.html`)

    win.once('ready-to-show', () => {
        
        splashScreen.destroy();
        win.show();
        win.maximize();
        win.focus();
    })

    // Event when the window is closed.
    win.on('closed', function() {
        win = null
    })
}

// Create window on electron intialization
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function() {

    // On macOS specific close process
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function() {
    // macOS specific close process
    if (win === null) {
        createWindow()
    }
})
