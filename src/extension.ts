import * as vscode from 'vscode';
import * as commands from './command';
import * as autoActivation from './template/auto-activation';
import * as renderer from './template/renderer';

/**
 * Actives the extension.
 *
 * @param context the context to activate within
 */
export function activate(context: vscode.ExtensionContext) {
    commands.activate(context);
    renderer.activate(context);
    autoActivation.activate(context);
}

/**
 * Deactivates the extension.
 */
export function deactivate() {
    // do nothing
}
