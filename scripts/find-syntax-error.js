const ts = require('typescript');
const fs = require('fs');

const file = 'src/data/calculators/extra/gesundheitFamilie.ts';
const content = fs.readFileSync(file, 'utf8');

const sourceFile = ts.createSourceFile(
  file,
  content,
  ts.ScriptTarget.Latest,
  true
);

const diagnostics = ts.getPreEmitDiagnostics(
  ts.createProgram([file], { noEmit: true })
);

console.log('Total diagnostics:', diagnostics.length);
for (const diag of diagnostics.slice(0, 10)) {
  if (diag.file) {
    const { line, character } = diag.file.getLineAndCharacterOfPosition(diag.start);
    console.log(`Error at line ${line + 1}, col ${character + 1}: ${ts.flattenDiagnosticMessageText(diag.messageText, '\n')}`);
    const lineContent = content.split('\n')[line];
    console.log(`Line content: ${lineContent}`);
  }
}
