import * as vscode from 'vscode';
import { computeTemplateRanges, Template } from '.';

/**
 * The decoration that is used for the template content.
 */
const DECORATION_TYPE = vscode.window.createTextEditorDecorationType({
    opacity: '0.4',
});

/**
 * The currently active templates keyed by their document.
 */
const activeTemplates = new Map<vscode.TextDocument, Template>();

/**
 * Renders the template for the given document or removes them if
 * there is no template for the document.
 *
 * @param document the document to render the template possibly for
 */
function renderForDocument(document: vscode.TextDocument) {
    const template = activeTemplates.get(document);
    const editor = vscode.window.visibleTextEditors.find(
        (editor) => editor.document === document,
    );

    if (!editor) {
        return;
    }

    if (!template) {
        editor.setDecorations(DECORATION_TYPE, []);

        return;
    }

    const templateRanges = computeTemplateRanges(template, document.getText());
    const decorationRanges = templateRanges.map(({ start, end }) => ({
        range: new vscode.Range(
            document.positionAt(start),
            document.positionAt(end),
        ),
    }));

    editor.setDecorations(DECORATION_TYPE, decorationRanges);
}

/**
 * Gets called once the visible code editors have changed.
 *
 * @param visibleEditors the visible editors
 */
function onVisibleTextEditorsChanged(
    visibleEditors: readonly vscode.TextEditor[],
) {
    for (const visibleEditor of visibleEditors) {
        const { document } = visibleEditor;

        renderForDocument(document);
    }
}

/**
 * Gets called once a text document has been opened.
 *
 * @param document the opened document
 */
function onTextDocumentOpened(document: vscode.TextDocument) {
    renderForDocument(document);
}

/**
 * Gets called once a document has been changed.
 *
 * @param event the change event
 */
function onTextDocumentChanged({ document }: vscode.TextDocumentChangeEvent) {
    renderForDocument(document);
}

/**
 * Gets called once a document has been closed.
 *
 * @param document the closed document
 */
function onTextDocumentClosed(document: vscode.TextDocument) {
    activeTemplates.delete(document);
}

/**
 * Enables the given `template` for the given `document`.
 *
 * @param document the document to enable a template for
 * @param template the template to enable
 */
export function enableTemplate(
    document: vscode.TextDocument,
    template: Template,
) {
    activeTemplates.set(document, template);

    renderForDocument(document);
}

/**
 * Disables any active template for the given `document`.
 *
 * @param document the document to disable any template for
 */
export function disableTemplate(document: vscode.TextDocument) {
    activeTemplates.delete(document);

    renderForDocument(document);
}

/**
 * Checks if the given `document` has some active template.
 *
 * @param document the document to check
 * @returns if the given `document` has an active template
 */
export function hasActiveTemplate(document: vscode.TextDocument) {
    return activeTemplates.has(document);
}

/**
 * Actives this module.
 *
 * @param context the context to activate within
 */
export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.window.onDidChangeVisibleTextEditors(
            onVisibleTextEditorsChanged,
        ),
        vscode.workspace.onDidOpenTextDocument(onTextDocumentOpened),
        vscode.workspace.onDidChangeTextDocument(onTextDocumentChanged),
        vscode.workspace.onDidCloseTextDocument(onTextDocumentClosed),
    );
}
