# vscode-templates

A simple vscode extension that can render pre-defined code templates more opaque than normal code.

## Usage

This extension will render all lines that are contributed by a code-template more opaque than normal code.

### Example Configuration

This is an example configuration for the `settings.json` file that should outline the capabilities of the extension.

```json
{
    "inflabs.templates.list": [
        {
            "name": "C Main",
            "content": "#include <stdio.h>\nint main(void)\n{\n    // TODO: YOUR CODE\n}"
        }
    ],
    "inflabs.templates.autoActivate": {
        ".c": "C Main"
    }
}
```

## Building

To build the extension, just run `npm run build`, this should also compile the typescript code.
