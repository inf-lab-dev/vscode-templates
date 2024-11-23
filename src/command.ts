import { commands, ExtensionContext, window } from 'vscode';
import { createTemplate } from './template';
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
    const editor = window.activeTextEditor!;

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
 * Actives this module.
 *
 * @param context the context to activate within
 */
export function activate(context: ExtensionContext) {
    context.subscriptions.push(
        commands.registerCommand('inflabs.templates.enable', enable),
        commands.registerCommand('inflabs.templates.disable', disable),
        commands.registerCommand('inflabs.templates.create', create),
    );
}
