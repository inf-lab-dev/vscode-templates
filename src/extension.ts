import * as vscode from 'vscode';
import { activate as activateCommand } from './command';
import { activate as activateRenderer } from './template/renderer';

/**
 * Actives the extension.
 *
 * @param context the context to activate within
 */
export function activate(context: vscode.ExtensionContext) {
    activateCommand(context);
    activateRenderer(context);
}

/**
 * Deactivates the extension.
 */
export function deactivate() {
    // do nothing
}
