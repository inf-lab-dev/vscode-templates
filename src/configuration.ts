import * as vscode from 'vscode';
import { Template } from './template';

/**
 * Gets the configuration
 *
 * @returns the configuration
 */
const getConfig = () => vscode.workspace.getConfiguration('inflabs.templates');

/**
 * Gets the stored templates.
 *
 * @returns the stored templates
 */
export function getTemplates(): Map<string, Template> {
    const entries = getConfig()
        .get<Template[]>('list', [])
        .map((template) => [template.name, template] as const);

    return new Map(entries);
}

/**
 * Sets the templates to the given `templates`.
 *
 * @param templates the templates to store
 */
export async function setTemplates(templates: Map<string, Template>) {
    await getConfig().update('list', Array.from(templates.values()));
}

/**
 * Gets the stored and valid auto-activates.
 * The key of this map is a pattern for a file-name and the value is the corresponding
 * template.
 *
 * @returns the auto-activates
 */
export function getAutoActivates(): Map<string, Template> {
    const templates = getTemplates();
    const entries = Object.entries(
        getConfig().get<Record<string, string>>('autoActivate', {}),
    )
        .filter(([, template]) => templates.has(template))
        .map(
            ([pattern, template]) =>
                [pattern, templates.get(template)!] as const,
        );

    return new Map(entries);
}
