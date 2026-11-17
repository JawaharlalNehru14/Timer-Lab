/**
 * Finds lines in a code string that contain some text and marks them.
 * Example: markLines(code, [["clearTimeout", "good"], ["// No cleanup", "bad"]])
 * Returns { [lineNumber]: "good" | "bad" } for CodeBlock.
 */
export function markLines(code, rules) {
  const marks = {};
  code.split("\n").forEach((line, index) => {
    for (const [text, type] of rules) {
      if (line.includes(text)) marks[index + 1] = type;
    }
  });
  return marks;
}
