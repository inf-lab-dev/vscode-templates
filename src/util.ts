import { TextEditor, window } from 'vscode';
import { getTemplates } from './configuration';
import { Template } from './template';

/**
 * Prompts the user to select a template.
 *
 * @param placeHolder the placeholder to show the user
 * @returns the selected template or `null` if the user aborted the selection
 */
export async function selectTemplate(
    placeHolder: string,
): Promise<Template | null> {
    const templates = getTemplates();

    const selectedTemplateName = await window.showQuickPick(
        Array.from(templates.keys()),
        { placeHolder },
    );

    if (!selectedTemplateName) {
        return null;
    }

    return templates.get(selectedTemplateName) ?? null;
}

/**
 * Returns the active text editor and shows an error message if
 * there is no active edtior, in which case `null` is returned.
 *
 * @returns possibly the active text editor
 */
export function requireActiveEditor(): TextEditor | null {
    const editor = window.activeTextEditor;

    if (!editor) {
        window.showErrorMessage('No active editor found.');

        return null;
    }

    return editor;
}

/**
 * Determines if a template can be applied, i.e.
 * if there are any templates and if there is an active editor.
 * If no templates exist, an error message will be shown.
 *
 * Uses {@link requireActiveEditor} internally.
 *
 * @returns if templates exist
 */
export function canTemplateBeApplied(): boolean {
    const templates = getTemplates();
    const editor = requireActiveEditor();

    if (!templates.size) {
        window.showErrorMessage('No templates found in settings.');

        return false;
    }

    return editor !== null;
}
