import {
    ExtensionContext,
    Range,
    TextDocument,
    TextDocumentChangeEvent,
    TextEditor,
    window,
    workspace,
} from 'vscode';
import { computeTemplateRanges, Template } from '.';
import { getAutoActivates } from '../configuration';

/**
 * The decoration that is used for the template content.
 */
const DECORATION_TYPE = window.createTextEditorDecorationType({
    color: 'gray',
});

/**
 * The currently active templates keyed by their document.
 */
const activeTemplates = new Map<TextDocument, Template>();

/**
 * Renders the template for the given document or removes them if
 * there is no template for the document.
 *
 * @param document the document to render the template possibly for
 */
function renderForDocument(document: TextDocument) {
    const template = activeTemplates.get(document);
    const editor = window.visibleTextEditors.find(
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
        range: new Range(document.positionAt(start), document.positionAt(end)),
    }));

    editor.setDecorations(DECORATION_TYPE, decorationRanges);
}

/**
 * Enables a template based on the auto-activates if there is no
 * template active for the given document
 *
 * @param document the document to possibly enable a teplate for
 */
function triggerAutoActivates(document: TextDocument) {
    if (activeTemplates.has(document)) {
        return;
    }

    const autoActivates = getAutoActivates();
    const uri = document.uri.toString();

    for (const [pattern, template] of autoActivates) {
        if (uri.endsWith(pattern)) {
            enableTemplate(document, template);

            break;
        }
    }
}

/**
 * Gets called once the visible code editors have changed.
 *
 * @param visibleEditors the visible editors
 */
function onVisibleTextEditorsChanged(visibleEditors: readonly TextEditor[]) {
    for (const visibleEditor of visibleEditors) {
        const { document } = visibleEditor;

        triggerAutoActivates(document);
        renderForDocument(document);
    }
}

/**
 * Gets called once a text document has been opened.
 *
 * @param document the opened document
 */
function onTextDocumentOpened(document: TextDocument) {
    triggerAutoActivates(document);
    renderForDocument(document);
}

/**
 * Gets called once a document has been changed.
 *
 * @param event the change event
 */
function onTextDocumentChanged({ document }: TextDocumentChangeEvent) {
    renderForDocument(document);
}

/**
 * Gets called once a document has been closed.
 *
 * @param document the closed document
 */
function onTextDocumentClosed(document: TextDocument) {
    activeTemplates.delete(document);
}

/**
 * Enables the given `template` for the given `document`.
 *
 * @param document the document to enable a template for
 * @param template the template to enable
 */
export function enableTemplate(document: TextDocument, template: Template) {
    activeTemplates.set(document, template);

    renderForDocument(document);
}

/**
 * Disables any active template for the given `document`.
 *
 * @param document the document to disable any template for
 */
export function disableTemplate(document: TextDocument) {
    activeTemplates.delete(document);

    renderForDocument(document);
}

/**
 * Actives this module.
 *
 * @param context the context to activate within
 */
export function activate(context: ExtensionContext) {
    context.subscriptions.push(
        window.onDidChangeVisibleTextEditors(onVisibleTextEditorsChanged),
        workspace.onDidOpenTextDocument(onTextDocumentOpened),
        workspace.onDidChangeTextDocument(onTextDocumentChanged),
        workspace.onDidCloseTextDocument(onTextDocumentClosed),
    );

    // auto-activate already open editors
    for (const editor of window.visibleTextEditors) {
        triggerAutoActivates(editor.document);
    }
}
