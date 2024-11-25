import * as vscode from 'vscode';
import { getAutoActivates } from '../configuration';
import { enableTemplate, hasActiveTemplate } from './renderer';

/**
 * Contains all documents that should **NOT** be auto-activated.
 */
let disableAutoActivation = new WeakSet<vscode.TextDocument>();

/**
 * Disables auto-activation for the given `document`.
 *
 * @param document the document to disable auto-activation for
 */
export function disable(document: vscode.TextDocument) {
    disableAutoActivation.add(document);
}

/**
 * Clears all auto-activation-disabled documents and re-triggers the auto-activation again.
 */
export function clearDisabled() {
    disableAutoActivation = new WeakSet();

    triggerActiveEditors();
}

/**
 * Enables a template based on the auto-activates if there is no
 * template active for the given document
 *
 * @param document the document to possibly enable a teplate for
 */
function trigger(document: vscode.TextDocument) {
    if (hasActiveTemplate(document) || disableAutoActivation.has(document)) {
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
 * Calls {@link trigger} for all active editors.
 */
function triggerActiveEditors() {
    // auto-activate already open editors
    for (const editor of vscode.window.visibleTextEditors) {
        trigger(editor.document);
    }
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

        trigger(document);
    }
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
    );

    triggerActiveEditors();
}
