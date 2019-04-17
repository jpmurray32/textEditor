var {app, BrowserWindow, Menu, MenuItem} = require('electron');
var path = require('path');
var url = require('url');
require('./index.js');

var win;

function createWindow() {
    win = new BrowserWindow({height:800, width:1000});

    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true,
    }));

    win.webContents.openDevTools();

    win.on('closed', () => {
        win = null;
    });
}

app.on('ready', function() {
    createWindow();

    var template = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'Open File',
                    click: function() {
                        win.webContents.executeJavaScript('clickFile()', true);
                    }
                },
                {
                    label: 'New File',
                    click: function() {
                        win.webContents.executeJavaScript('createName()', true);
                    }
                },
                {type: 'separator'},
                {
                    label: 'Delete File',
                    click: function() {
                        win.webContents.executeJavaScript('deleteFile()', true);
                    }
                },
                {type: 'separator'},
                {
                    label: 'Exit',
                    click: function() {
                        if (process.platform !== 'darwin') {
                            app.quit();
                        }
                    }
                }
            ]
        },
        {
            label: "Edit",
            submenu: [
                {role: 'undo'},
                {role: 'redo'},
                {type: 'separator'},
                {role: 'cut'},
                {role: 'copy'},
                {role: 'paste'},
                {role: 'selectall'}
            ]
        }
    ];

    var menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});