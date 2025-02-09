const vscode = require('vscode');

function activate(context) {
    let disposable = vscode.commands.registerCommand('extension.showDesigner', function (uri) {
        vscode.window.showInformationMessage(`Opening PI Designer for ${uri.fsPath}`);
        
        const panel = vscode. window.createWebviewPanel(
            'designerView', // Identifies the type of the webview. Used internally
            'PI Designer', // Title of the panel displayed to the user
            vscode.ViewColumn.One, // Editor column to show the new webview panel in. Use `ViewColumn.Beside` to open to the side of the current active editor
            {}
        );

        // Load the HTML content into the webview
        panel.webview.html = getWebviewContent(context);
    });

    context.subscriptions.push(disposable);
}

function getWebviewContent(context) {
    // Path to the html file inside the extension
    const htmlFilePath = path.join(context.extensionPath, 'extension.html');
    
    // Read the file's content
    const html = fs.readFileSync(htmlFilePath, 'utf8');

    // You can transform or inject data here if you want,
    // for example, add dynamic URI or pass variables:
    // const updatedHtml = html.replace('%%FILE_PATH%%', uri.fsPath);

    return html;
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
