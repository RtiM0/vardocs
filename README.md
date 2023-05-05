# VarDocs

VarDocs is a Visual Studio Code extension that uses OpenAI API to explain code snippets or variables in the context of their function.

## Features

- Vardocs: Show Purpose command which provides explanations for the selected line or word in the context of its function.
- A markdown hover which displays a Show Purpose link to quickly trigger the command.

## Requirements

To use this extension, you need an OpenAI API key. If you don't have one, you can sign up for free at the [OpenAI](https://platform.openai.com/account/api-keys) website.

## Extension Settings

This extension contributes the following settings:

- `vardocs.Openai API KEY`: Set your openai api key.
- `vardocs.Openai Model`: Change the model.
- `vardocs.MaxTokens`: Max tokens to use with model.

## Known Issues

- Hover for every word is infected when only variables show get the markdown.

## Release Notes

### 0.9.0

Initial release

## Roadmap

In future releases, VarDocs will include additional features such as:

- The ability to ask other questions similar to "Show Purpose," such as "Will this code work?"

## Contributing

Contributions are welcome! Feel free to submit a pull request or open an issue on the [GitHub repository](https://github.com/RtiM0/vardocs).

## License

This extension is licensed under the [MIT License](/LICENSE.md).
