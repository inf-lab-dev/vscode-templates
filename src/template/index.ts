import * as diff from 'diff';
import { TextEditor, window } from 'vscode';
import { getTemplates, setTemplates } from '../configuration';
import { enableTemplate } from './renderer';

/**
 * A template.
 */
export interface Template {
    /**
     * The name of the template.
     */
    name: string;

    /**
     * The diffable content of the template.
     */
    content: string;
}

/**
 * Some range that only exists as offsets.
 */
export interface OffsetRange {
    /**
     * The start of the offset.
     */
    start: number;

    /**
     * The end of the offset.
     */
    end: number;
}

/**
 * Computes the {@link OffsetRange}s, the given `template` consists of inside the given `document`.
 *
 * @param template the template to find the ranges for
 * @param document the document content to search in
 * @returns all found ranges
 */
export function computeTemplateRanges(
    template: Template,
    document: string,
): OffsetRange[] {
    const matchingRanges: OffsetRange[] = [];
    const differences = diff.diffLines(template.content, document, {
        ignoreNewlineAtEof: true,
        newlineIsToken: true,
    });

    let currentIndex = 0;

    for (const difference of differences) {
        if (difference.added) {
            // Skip added lines (present in the document but not the template)
            currentIndex += difference.value.length;
        } else if (!difference.removed) {
            // Common lines (matching lines)
            const start = currentIndex;
            const end = currentIndex + difference.value.length;

            matchingRanges.push({ start, end });

            currentIndex = end;
        }
    }

    return matchingRanges;
}

/**
 * Creates a new template from the given editor and pays attention
 * so no content would be overwritten without explicit permission.
 *
 * @param editor the editor to create a template from
 */
export async function createTemplate(editor: TextEditor) {
    const templates = getTemplates();
    const fileNameParts = editor.document.uri.path.split('/');

    const template = {
        name: fileNameParts.at(-1)!,
        content: editor.document.getText(),
    };

    if (templates.has(template.name)) {
        const answer = await window.showInformationMessage(
            `A template with the name ${template.name} already exists, do you want to overwrite?`,
            'Yes',
            'No',
        );

        if (answer !== 'Yes') {
            return;
        }
    }

    templates.set(template.name, template);

    await setTemplates(templates);
    enableTemplate(editor.document, template);
}
