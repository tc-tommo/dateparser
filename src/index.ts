import { NaturalLanguageParser } from './parser/parser';
import { iCalendarGenerator } from './parser/icalendar-generator';
import { ParserConfig, ComponentType } from './parser/types';

// Example usage of the natural language parser
export class DateParser {
  private parser: NaturalLanguageParser;
  private generator: iCalendarGenerator;

  constructor(config?: Partial<ParserConfig>) {
    const defaultConfig: ParserConfig = {
      patterns: [],
      referenceDate: new Date(),
      timezone: 'UTC',
      locale: 'en-US'
    };

    this.parser = new NaturalLanguageParser({ ...defaultConfig, ...config });
    this.generator = new iCalendarGenerator(this.parser);
  }

  /**
   * Parse a natural language phrase and convert to iCalendar format
   */
  parseToCalendar(text: string) {
    // Step 1: Parse the text into components
    const parsedPhrase = this.parser.parse(text);
    
    // Step 2: Generate iCalendar event
    const event = this.generator.generateEvent(parsedPhrase);
    
    return {
      originalText: text,
      parsedComponents: parsedPhrase.components,
      iCalendarEvent: event,
      validation: this.parser.validatePhrase(parsedPhrase)
    };
  }

  /**
   * Get detailed parsing information
   */
  getParsingDetails(text: string) {
    const parsedPhrase = this.parser.parse(text);
    
    return {
      originalText: text,
      components: parsedPhrase.components,
      timeComponents: this.parser.getComponentsByType(parsedPhrase, ComponentType.TIME),
      dateComponents: this.parser.getComponentsByType(parsedPhrase, ComponentType.DATE),
      weekdayComponents: this.parser.getComponentsByType(parsedPhrase, ComponentType.WEEKDAY),
      recurrenceComponents: this.parser.getComponentsByType(parsedPhrase, ComponentType.RECURRENCE),
      validation: this.parser.validatePhrase(parsedPhrase)
    };
  }
}

// Export the main classes for external use
export { NaturalLanguageParser } from './parser/parser';
export { iCalendarGenerator } from './parser/icalendar-generator';
export * from './parser/types'; 