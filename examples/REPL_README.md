# Date Parser REPL

An interactive Read-Eval-Print Loop (REPL) for testing and experimenting with the Natural Language Date Parser.

## 🚀 Quick Start

```bash
# Run the REPL
npm run repl

# Or directly with ts-node
npx ts-node examples/repl.ts
```

## 📖 Available Commands

### Basic Parsing
- **Direct input**: Just type any text to parse it
- **`parse <text>`**: Explicitly parse text to iCalendar format
- **`details <text>`**: Show detailed parsing analysis with component breakdown

### Configuration
- **`config`**: Show current parser configuration
- **`set timezone <value>`**: Set timezone (e.g., `America/New_York`, `Europe/London`)
- **`set locale <value>`**: Set locale (e.g., `en-US`, `en-GB`)
- **`set refdate <date>`**: Set reference date (ISO format, e.g., `2024-01-15`)

### Help & Examples
- **`examples`**: Show example phrases you can try
- **`help`**: Show all available commands
- **`clear`**: Clear the screen

### Exit
- **`exit`** or **`quit`**: Exit the REPL

## 💡 Example Usage

```
dateparser> help
📖 Available Commands:
──────────────────────────────
parse <text>     - Parse natural language to iCalendar
details <text>   - Show detailed parsing analysis
config           - Show current configuration
set <prop> <val> - Set configuration property
examples         - Show example phrases
clear            - Clear the screen
help             - Show this help
exit/quit        - Exit the REPL

💡 You can also just type text directly to parse it!

dateparser> examples
📚 Example Phrases:
──────────────────────────────
1. "this wed new event 10am"
2. "every tue afternoon 5pm at the office"
3. "wed 10am"
4. "tomorrow 3pm for 1hr"
5. "every mon 9am"
6. "fri 3pm rem 15 mins before"
7. "next tue 2pm"
8. "jan 15th 3:30pm"
9. "every other sat 9am"
10. "mon, thu & sat 2pm"

💡 Try: parse "example phrase"

dateparser> parse "every mon 9am"
🔍 Parsing: "every mon 9am"
──────────────────────────────────────────────────
✅ Successfully parsed!

📅 iCalendar Event:
{
  "summary": "Event",
  "dtstart": "2024-01-15T09:00:00.000Z",
  "rrule": {
    "freq": "WEEKLY",
    "byday": ["MO"]
  }
}

dateparser> details "tomorrow 3pm for 1hr"
🔍 Detailed Analysis: "tomorrow 3pm for 1hr"
──────────────────────────────────────────────────
📋 Parsed Components:

  DATE:
    - "tomorrow" (confidence: 0.9)

  TIME:
    - "3pm" (confidence: 0.9)

  DURATION:
    - "1hr" (confidence: 0.9)

dateparser> set timezone America/New_York
✅ Timezone set to: America/New_York

dateparser> config
⚙️  Current Configuration:
──────────────────────────────
Reference Date: 2024-01-15T10:30:00.000Z
Timezone: America/New_York
Locale: en-US
Custom Patterns: 0
```

## 🎯 Features

- **Interactive Testing**: Quickly test different phrases and see results
- **Detailed Analysis**: Get component-by-component breakdown of parsing
- **Configuration Management**: Change timezone, locale, and reference date on the fly
- **Example Library**: Built-in examples to get started
- **Error Handling**: Graceful handling of parsing errors and validation issues
- **Pretty Output**: Formatted JSON output and emoji indicators

## 🔧 Configuration Options

The REPL supports the same configuration options as the main DateParser:

- **Timezone**: Affects how dates and times are interpreted
- **Locale**: Affects date formatting and parsing
- **Reference Date**: Base date for relative expressions like "tomorrow"

## 🚨 Troubleshooting

If you encounter issues:

1. **TypeScript errors**: Make sure you have `ts-node` installed globally or use `npx ts-node`
2. **Import errors**: Ensure you're running from the project root directory
3. **Parsing failures**: Use `details` command to see what components were detected

## 📝 Tips

- Use quotes around phrases with spaces: `parse "every monday at 9am"`
- Try the `details` command to understand how the parser breaks down text
- Experiment with different timezones to see how they affect parsing
- Use `clear` to keep your terminal organized during testing 