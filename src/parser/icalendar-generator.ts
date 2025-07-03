import { ParsedPhrase, ParsedComponent, ComponentType, iCalendarEvent, RecurrenceRule } from './types';
import { NaturalLanguageParser } from './parser';

export class iCalendarGenerator {
  private parser: NaturalLanguageParser;

  constructor(parser: NaturalLanguageParser) {
    this.parser = parser;
  }

  /**
   * Convert a parsed phrase to iCalendar event format
   */
  generateEvent(phrase: ParsedPhrase): iCalendarEvent | null {
    const validation = this.parser.validatePhrase(phrase);
    if (!validation.isValid) {
      // Log validation warnings for debugging
      if (validation.warnings.length > 0) {
        // In a real application, you might want to use a proper logging library
        // For now, we'll just return null for invalid phrases
      }
      return null;
    }

    const event: iCalendarEvent = {
      start: new Date(),
      summary: this.extractSummary(phrase),
      location: this.extractLocation(phrase),
      timezone: phrase.referenceDate ? this.getTimezone() : undefined
    };

    // Extract and set start time/date
    const startDateTime = this.extractStartDateTime(phrase);
    if (startDateTime) {
      event.start = startDateTime;
    }

    // Extract and set end time/duration
    const endDateTime = this.extractEndDateTime(phrase);
    if (endDateTime) {
      event.end = endDateTime;
    } else {
      const duration = this.extractDuration(phrase);
      if (duration) {
        event.duration = duration;
      }
    }

    // Extract recurrence
    const recurrence = this.extractRecurrence(phrase);
    if (recurrence) {
      event.recurrence = recurrence;
    }

    // Extract reminders
    const reminders = this.extractReminders(phrase);
    if (reminders.length > 0) {
      event.reminders = reminders;
    }

    return event;
  }

  private extractSummary(phrase: ParsedPhrase): string | undefined {
    // Look for text that's not part of any parsed component
    const usedRanges = phrase.components.map(c => [c.startIndex, c.endIndex]);
    const words = phrase.originalText.split(/\s+/);
    
    const summaryWords: string[] = [];
    let currentIndex = 0;
    
    for (const word of words) {
      const wordStart = phrase.originalText.indexOf(word, currentIndex);
      const wordEnd = wordStart + word.length;
      
      const isUsed = usedRanges.some(([start, end]) => 
        wordStart < end && wordEnd > start
      );
      
      if (!isUsed && word.length > 2) {
        summaryWords.push(word);
      }
      
      currentIndex = wordEnd;
    }
    
    return summaryWords.length > 0 ? summaryWords.join(' ') : undefined;
  }

  private extractLocation(phrase: ParsedPhrase): string | undefined {
    // Look for location patterns like "at the office", "in room 101"
    const locationPatterns = [
      /\bat\s+([^,\n]+)/i,
      /\bin\s+([^,\n]+)/i,
      /\broom\s+(\d+)/i,
      /\boffice\b/i,
      /\bhome\b/i
    ];
    
    for (const pattern of locationPatterns) {
      const match = phrase.originalText.match(pattern);
      if (match) {
        return match[1] || match[0];
      }
    }
    
    return undefined;
  }

  private extractStartDateTime(phrase: ParsedPhrase): Date | null {
    const timeComponent = this.parser.getBestComponent(phrase, ComponentType.TIME);
    const intervalComponent = this.parser.getBestComponent(phrase, ComponentType.INTERVAL);
    const dateComponent = this.parser.getBestComponent(phrase, ComponentType.DATE);
    const weekdayComponent = this.parser.getBestComponent(phrase, ComponentType.WEEKDAY);
    
    let targetDate = new Date(phrase.referenceDate);
    
    // Apply date component
    if (dateComponent) {
      if (dateComponent.value.date) {
        targetDate = new Date(dateComponent.value.date);
      } else if (dateComponent.value.offset) {
        targetDate.setDate(targetDate.getDate() + dateComponent.value.offset);
      }
    }
    
    // Apply weekday component
    if (weekdayComponent && !dateComponent) {
      const targetWeekday = weekdayComponent.value.weekday;
      const currentWeekday = targetDate.getDay();
      
      let daysToAdd = targetWeekday - currentWeekday;
      if (daysToAdd <= 0) daysToAdd += 7;
      
      targetDate.setDate(targetDate.getDate() + daysToAdd);
    }
    
    // Apply time component (prioritize INTERVAL start time over individual TIME)
    if (intervalComponent && intervalComponent.value.start) {
      if (intervalComponent.value.start.hour !== undefined) {
        targetDate.setHours(intervalComponent.value.start.hour);
      }
      if (intervalComponent.value.start.minute !== undefined) {
        targetDate.setMinutes(intervalComponent.value.start.minute);
      }
      targetDate.setSeconds(0);
      targetDate.setMilliseconds(0);
    } else if (timeComponent) {
      if (timeComponent.value.hour !== undefined) {
        targetDate.setHours(timeComponent.value.hour);
      }
      if (timeComponent.value.minute !== undefined) {
        targetDate.setMinutes(timeComponent.value.minute);
      }
      targetDate.setSeconds(0);
      targetDate.setMilliseconds(0);
    }
    
    return targetDate;
  }

  private extractEndDateTime(phrase: ParsedPhrase): Date | null {
    // First check for INTERVAL component (time ranges like "4pm to 8pm")
    const intervalComponent = this.parser.getBestComponent(phrase, ComponentType.INTERVAL);
    if (intervalComponent && intervalComponent.value.end) {
      const startDate = this.extractStartDateTime(phrase);
      if (startDate) {
        const endDate = new Date(startDate);
        endDate.setHours(intervalComponent.value.end.hour);
        endDate.setMinutes(intervalComponent.value.end.minute);
        endDate.setSeconds(0);
        endDate.setMilliseconds(0);
        return endDate;
      }
    }
    
    return null;
  }

  private extractDuration(phrase: ParsedPhrase): string | undefined {
    // Look for duration patterns like "for 1hr", "1.5hrs"
    const durationPatterns = [
      /\bfor\s+(\d+(?:\.\d+)?)\s*(hr|hour|hours)\b/i,
      /\b(\d+(?:\.\d+)?)\s*(hr|hour|hours)\b/i,
      /\bfor\s+(\d+)\s*(min|minute|minutes)\b/i,
      /\b(\d+)\s*(min|minute|minutes)\b/i
    ];
    
    for (const pattern of durationPatterns) {
      const match = phrase.originalText.match(pattern);
      if (match) {
        const value = parseFloat(match[1]);
        const unit = match[2].toLowerCase();
        
        if (unit.startsWith('hr')) {
          return `PT${value}H`;
        } else if (unit.startsWith('min')) {
          return `PT${value}M`;
        }
      }
    }
    
    return undefined;
  }

  private extractRecurrence(phrase: ParsedPhrase): RecurrenceRule | undefined {
    const recurrenceComponent = this.parser.getBestComponent(phrase, ComponentType.RECURRENCE);
    
    if (recurrenceComponent) {
      return recurrenceComponent.value as RecurrenceRule;
    }
    
    return undefined;
  }

  private extractReminders(phrase: ParsedPhrase): Array<{ type: 'DISPLAY' | 'EMAIL' | 'AUDIO'; trigger: string }> {
    const reminders: Array<{ type: 'DISPLAY' | 'EMAIL' | 'AUDIO'; trigger: string }> = [];
    
    // Look for reminder patterns
    const reminderPatterns = [
      /\bremind\s+me\s+(\d+)\s*(min|minute|minutes)\s+before\b/i,
      /\brem\s+(\d+)\s*(min|minute|minutes)\s+before\b/i,
      /\b(\d+)\s*(min|minute|minutes)\s+before\b/i
    ];
    
    for (const pattern of reminderPatterns) {
      const match = phrase.originalText.match(pattern);
      if (match) {
        const minutes = parseInt(match[1]);
        reminders.push({
          type: 'DISPLAY',
          trigger: `-PT${minutes}M`
        });
      }
    }
    
    return reminders;
  }

  private getTimezone(): string {
    // Return the current timezone or a default
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      return 'UTC';
    }
  }
} 