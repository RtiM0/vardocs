import * as vscode from 'vscode';
import { Configuration, OpenAIApi } from 'openai';

export function activate(context: vscode.ExtensionContext) {
	const apiKey = vscode.workspace.getConfiguration().get('OpenAI API KEY') as string;
	if (!apiKey) {
		vscode.window.showErrorMessage("Please set OPENAI API KEYS for VarDocs and reload window!");
	}

	const configuration = new Configuration({
		apiKey,
	});
	const openai = new OpenAIApi(configuration);


	vscode.languages.registerHoverProvider('*', {
		provideHover(document, position) {
			const markupContent = new vscode.MarkdownString(`[Show Purpose](command:vardocs.showPurpose)`);
			markupContent.isTrusted = true;
			return new vscode.Hover(markupContent);
		}
	});

	let disposasble = vscode.commands.registerCommand('vardocs.showPurpose', async () => {
		vscode.window.withProgress({
			location: vscode.ProgressLocation.Notification,
			title: "Thinking...",
			cancellable: false,
		}, async (progress, token) => {
			const editor = vscode.window.activeTextEditor;
			const symbolsToFind = [vscode.SymbolKind.Function, vscode.SymbolKind.Method, vscode.SymbolKind.Constructor];

			const docSymbols = await vscode.commands.executeCommand(
				'vscode.executeDocumentSymbolProvider',
				editor.document.uri
			) as vscode.DocumentSymbol[];

			const docSymbolsFunctionsMethods = docSymbols
				? docSymbols.filter(symbol => symbolsToFind.includes(symbol.kind))
				: undefined;

			const selection = editor.selection;
			if (!selection && selection.isEmpty) {
				vscode.window.showErrorMessage("Could not find selection");
				return undefined;
			}
			const wordRange = editor.document.getWordRangeAtPosition(selection.active);
			const selectionRange = new vscode.Range(selection.start.line, selection.start.character, selection.end.line, selection.end.character);
			const word = editor.document.getText(selectionRange).trim() || editor.document.getText(wordRange);

			if (!word) {
				vscode.window.showErrorMessage("Could not find selection");
				return undefined;
			};
			let func = ""
			for (const element of docSymbolsFunctionsMethods) {
				if (element.range.contains(vscode.window.activeTextEditor.selection.start)) {
					const body = vscode.window.activeTextEditor.document.getText(element.range);
					func += body;
				}
			}
			if (!func) {
				vscode.window.showErrorMessage("Could not find function");
				return undefined;
			};
			const completion = await openai.createCompletion({
				model: vscode.workspace.getConfiguration().get('OpenAI Model') as string,
				prompt: `FUNCTION:\n\n${func}\n\nExplain What is the purpose of the variable or line '${word}'?`,
				max_tokens: 64,
				top_p: 1,
			})
			const choice = completion.data.choices[0].text;
			vscode.window.showInformationMessage(choice);
		});

	});

	context.subscriptions.push(disposasble);
}

export function deactivate() { }
