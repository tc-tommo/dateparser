# Natural Language Date Parser

A TypeScript-based natural language parser that converts scheduling phrases into iCalendar format. This project demonstrates a clean, extensible architecture for parsing complex temporal expressions.

## 🏗️ Software Engineering Architecture

### Design Patterns Used

1. **Pipeline Pattern**: Text → Tokenization → Pattern Matching → Component Extraction → iCalendar Generation
2. **Strategy Pattern**: Different parsing strategies for different component types
3. **Factory Pattern**: Pattern creation and component generation
4. **Builder Pattern**: iCalendar event construction

### Core Components

```
src/
├── parser/
│   ├── types.ts              # Core interfaces and types
│   ├── parser.ts             # Main parsing orchestrator
│   ├── icalendar-generator.ts # iCalendar conversion
│   └── patterns/             # Pattern definitions
│       ├── time-patterns.ts  # Time parsing patterns
│       ├── date-patterns.ts  # Date parsing patterns
│       └── recurrence-patterns.ts # Recurrence patterns
├── index.ts                  # Main entry point
└── datetime.ts              # Legacy datetime utilities
```

## 🚀 Quick Start

```typescript
import { DateParser } from './src/index';

// Create a parser instance
const dateParser = new DateParser();

// Parse a natural language phrase
const result = dateParser.parseToCalendar("every mon 9am at the office");

if (result.iCalendarEvent) {
  console.log("✅ Parsed successfully:", result.iCalendarEvent);
} else {
  console.log("❌ Failed to parse:", result.validation.warnings);
}
```

## 📋 Supported Patterns

### Time Expressions
- `10am`, `2:30pm`, `14:30`, `1430` (military time)
- `noon`, `midnight`, `morning`, `afternoon`, `evening`

### Date Expressions
- `mon`, `tue`, `wed` (weekday abbreviations)
- `tomorrow`, `in 2 days`
- `next tue`, `jan 15th`

### Recurrence Patterns
- `every mon`, `every other sat`
- `daily`, `weekly`, `monthly`
- `mon, thu & sat` (multiple weekdays)

### Duration & Intervals
- `for 1hr`, `1.5hrs`, `30mins`
- `from 2pm to 4pm`, `2-4pm`

### Reminders
- `remind me 15 mins before`
- `rem 1hr before`

## 🛠️ Extending the Parser

### Adding New Patterns

1. Create a new pattern file in `src/parser/patterns/`:

```typescript
import { Pattern, ComponentType } from '../types';

export const customPatterns: Pattern[] = [
  {
    name: "Custom Pattern",
    regex: /\b(your|regex|pattern)\b/i,
    confidence: 0.9,
    priority: 1,
    parse: (match, context) => ({
      text: match[0],
      startIndex: match.index!,
      endIndex: match.index! + match[0].length,
      type: ComponentType.YOUR_TYPE,
      value: { /* parsed value */ },
      confidence: 0.9
    })
  }
];
```

2. Register the patterns in the parser:

```typescript
import { customPatterns } from './patterns/custom-patterns';

const parser = new DateParser({
  patterns: customPatterns
});
```

### Adding New Component Types

1. Add to the `ComponentType` enum in `types.ts`:

```typescript
export enum ComponentType {
  // ... existing types
  YOUR_NEW_TYPE = "your_new_type"
}
```

2. Create corresponding patterns and update the iCalendar generator.

## 🧪 Testing

Run the example to see the parser in action:

```bash
npm run build
npx ts-node examples/basic-usage.ts
```

## 📊 Architecture Benefits

### 1. **Modularity**
- Each pattern type is isolated in its own file
- Easy to add/remove patterns without affecting others
- Clear separation of concerns

### 2. **Extensibility**
- New patterns can be added without modifying core logic
- Support for custom component types
- Pluggable architecture

### 3. **Maintainability**
- Type-safe with TypeScript
- Clear interfaces and contracts
- Well-documented code structure

### 4. **Performance**
- Priority-based pattern matching
- Conflict resolution for overlapping patterns
- Efficient regex-based parsing

### 5. **Reliability**
- Confidence scoring for ambiguous matches
- Validation of parsed components
- Graceful handling of edge cases

## 🔧 Configuration Options

```typescript
const parser = new DateParser({
  referenceDate: new Date(),     // Base date for relative calculations
  timezone: 'America/New_York',  // Timezone for date/time parsing
  locale: 'en-US',              // Locale for date formatting
  patterns: [],                 // Custom patterns to add
  userPreferences: {}           // User-specific preferences
});
```

## 📈 Future Enhancements

1. **Machine Learning Integration**: Use ML models for better fuzzy matching
2. **Multi-language Support**: Extend patterns for other languages
3. **Context Awareness**: Learn from user's calendar history
4. **Natural Language Generation**: Convert iCalendar back to natural language
5. **Advanced Recurrence**: Support complex recurrence patterns
6. **Timezone Handling**: Better timezone conversion and validation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add your patterns or improvements
4. Write tests for new functionality
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details. 