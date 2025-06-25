import { DateParser } from '../src/index';

// Create a parser instance
const dateParser = new DateParser();

// Example phrases from your taxonomy
const examples = [
  "this wed new event 10am",
  "every tue afternoon 5pm at the office", 
  "wed 10am",
  "tomorrow 3pm for 1hr",
  "every mon 9am",
  "fri 3pm rem 15 mins before"
];

// Test each example
examples.forEach((example, index) => {
  console.log(`\n=== Example ${index + 1}: "${example}" ===`);
  
  // Get detailed parsing information
  const details = dateParser.getParsingDetails(example);
  
  console.log("Parsed Components:");
  details.components.forEach(component => {
    console.log(`  - ${component.type}: "${component.text}" (confidence: ${component.confidence})`);
  });
  
  // Convert to iCalendar format
  const result = dateParser.parseToCalendar(example);
  
  if (result.iCalendarEvent) {
    console.log("✅ Successfully converted to iCalendar format:");
    console.log(JSON.stringify(result.iCalendarEvent, null, 2));
  } else {
    console.log("❌ Failed to convert to iCalendar format");
    console.log("Validation issues:", result.validation.warnings);
  }
});

// Example of custom configuration
console.log("\n=== Custom Configuration Example ===");
const customParser = new DateParser({
  referenceDate: new Date('2024-01-15'), // Set a specific reference date
  timezone: 'Europe/London',
  locale: 'en-US'
});

const customResult = customParser.parseToCalendar("next tue 2pm");
console.log("Custom parser result:", customResult.iCalendarEvent); 