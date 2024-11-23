# vscode-templates

A simple vscode extension that can render pre-defined code templates in gray.

## Usage

This extension shall render all lines that are contributed by a code-template in gray. As this data needs to be statically available, the extension needs to be bundled together with those templates.

Thats the purpose of the `update-templates.mjs` script, in which a constant is defined that imports the various templates. It can be run using `npm run update-templates`

## Building

To build the extension, just run `npm run build`, this will also update the templates.
