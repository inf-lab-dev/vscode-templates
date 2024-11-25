import * as vscode from 'vscode';
import { createTemplate } from './template';
import * as autoActivation from './template/auto-activation';
import { disableTemplate, enableTemplate } from './template/renderer';
import {
    canTemplateBeApplied,
    requireActiveEditor,
    selectTemplate,
} from './util';

/**
 * Enables a template after asking the user to select one.
 */
async function enable() {
    const editor = vscode.window.activeTextEditor!;

    if (!canTemplateBeApplied()) {
        return;
    }

    const selectedTemplate = await selectTemplate(
        'Select template to apply...',
    );

    if (!selectedTemplate) {
        return;
    }

    const document = editor.document;

    enableTemplate(document, selectedTemplate);
}

/**
 * Disables a template for the current editor.
 */
function disable() {
    const editor = requireActiveEditor();

    if (editor) {
        disableTemplate(editor.document);
    }
}

/**
 * Creates a template from the current editor.
 */
async function create() {
    const editor = requireActiveEditor();

    if (editor) {
        await createTemplate(editor);
    }
}

/**
 * Disables the auto-activation for the active document.
 */
function disableAutoActivation() {
    const editor = requireActiveEditor();

    if (editor) {
        autoActivation.disable(editor.document);
    }
}

/**
 * Clears the disabled auto-activations.
 */
function clearDisabledAutoActivation() {
    autoActivation.clearDisabled();
}

/**
 * Actives this module.
 *
 * @param context the context to activate within
 */
export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('inflabs.templates.enable', enable),
        vscode.commands.registerCommand('inflabs.templates.disable', disable),
        vscode.commands.registerCommand('inflabs.templates.create', create),
        vscode.commands.registerCommand(
            'inflabs.templates.autoActivation.disable',
            disableAutoActivation,
        ),
        vscode.commands.registerCommand(
            'inflabs.templates.autoActivation.clearDisabled',
            clearDisabledAutoActivation,
        ),
    );
}
