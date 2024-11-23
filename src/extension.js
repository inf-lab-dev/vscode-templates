const vscode = require('vscode');
const templates = require('./templates');

/**
 * Shorthand for the keys of the templates.
 */
const TEMPLATE_FILE_NAMES = Object.keys(templates);

/**
 * Updates the decorations inside the active editor.
 */
function updateDecorations() {
    const editor = vscode.window.activeTextEditor;
    const matchingTemplate = TEMPLATE_FILE_NAMES.find(fileName =>
        editor.document.fileName.endsWith(fileName)
    );

    if (!editor || !matchingTemplate) {
        return;
    }

    const templateLines = templates[matchingTemplate];

    const { document } = editor;
    const ranges = [];
    const decorationType = vscode.window.createTextEditorDecorationType({
        color: 'gray',
    });

    for (let i = 0; i < document.lineCount; i++) {
        const line = document.lineAt(i);

        if (templateLines.includes(line.text)) {
            ranges.push({ range: line.range });
        }
    }

    editor.setDecorations(decorationType, ranges);
}

/**
 * Activates the extension
 *
 * @param {vscode.ExtensionContext} context the context
 */
function activate(context) {
    updateDecorations();

    context.subscriptions.push(
        vscode.workspace.onDidOpenTextDocument(() => updateDecorations()),
        vscode.workspace.onDidChangeTextDocument(() => updateDecorations())
    );
}

/**
 * Deactivates the extension
 */
function deactivate() {
    // does nothing
}

module.exports = {
    activate,
    deactivate,
};
