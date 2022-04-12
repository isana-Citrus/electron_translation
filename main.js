const electron = require("electron");
const ts = require("./translate");
//electron読み込んでapp,BrowserWindowを取り出す
const { app, BrowserWindow, globalShortcut, clipboard, ipcMain, Notification, } = electron;
const path = require("path");           //pathはjoin用
let mainWindow;
//electron が準備終わったとき
app.on("ready", function () {
    //新しいウインドウを開く
    mainWindow = new BrowserWindow({
        width: 600,
        height: 140,
        frame: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    //mainWindowでhtmlファイルを開く
    //"file://" + path.join(__dirname, 'index.html'); => file://作業ディレクトリ/index.html
    mainWindow.loadURL("file://" + path.join(__dirname, 'index.html'));

    //メインウインドウが閉じたらアプリが終了する
    mainWindow.on("closed", function () {
        app.quit();
    });
});

app.whenReady().then(() => {
    // 'CommandOrControl+Alt+X' ショートカットのリスナーを登録します。
    const ret = globalShortcut.register('CommandOrControl+Alt+X', async () => {
        console.log('CommandOrControl+Alt+X is pressed');
        const original_text = clipboard.readText();//クリップボードのテキストを取得
        let result = await ts.en2ja(original_text);
        const data = {
            ot: original_text,
            tt: result
        }
        if (process.platform === "linux") {
            mainWindow.hide();
        }
        mainWindow.show();
        //showNotification(data);
        mainWindow.webContents.send("trans_exec", data);//mainWindowへipc通信を送信
        console.log(result);
    })

    if (!ret) {
        console.log('registration failed');
    }

    // ショートカットが登録されているかどうかをチェックします。
    console.log("add global shortcut:", globalShortcut.isRegistered('CommandOrControl+Alt+X'));
})

app.on('will-quit', () => {
    // ショートカットを登録解除します。
    globalShortcut.unregister('CommandOrControl+Alt+X');

    // すべてのショートカットを登録解除します。
    globalShortcut.unregisterAll();
});
//(async () => { let result = await ts.en2ja("hello world"); console.log(result); })();

// IPC通信(API関係)
//quit
ipcMain.handle('quit', (event, data) => {
    app.quit();
});
function showNotification(data) {
    new Notification({ title: "翻訳完了", body: data["tt"] }).show()
}   