// Core parsing types and interfaces

export interface ParsedComponent {
  text: string;
  startIndex: number;
  endIndex: number;
  type: ComponentType;
  value: any;
  confidence: number;
  metadata?: Record<string, any>;
}

export interface ParsedPhrase {
  originalText: string;
  components: ParsedComponent[];
  referenceDate: Date;
  iCalendarData?: iCalendarEvent;
}

export interface iCalendarEvent {
  summary?: string;
  start: Date;
  end?: Date;
  duration?: string;
  location?: string;
  description?: string;
  recurrence?: RecurrenceRule;
  reminders?: Reminder[];
  timezone?: string;
}

export interface RecurrenceRule {
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  interval?: number;
  byDay?: string[];
  byMonth?: number[];
  byMonthDay?: number[];
  until?: Date;
  count?: number;
  exceptions?: Date[];
}

export interface Reminder {
  type: 'DISPLAY' | 'EMAIL' | 'AUDIO';
  trigger: string; // e.g., "-PT15M" for 15 minutes before
}

export enum ComponentType {
  // Temporal components
  TIME = "time",
  DATE = "date", 
  WEEKDAY = "weekday",
  MONTH = "month",
  YEAR = "year",
  DURATION = "duration",
  INTERVAL = "interval",
  
  // Recurrence components
  RECURRENCE = "recurrence",
  FREQUENCY = "frequency",
  EXCEPTION = "exception",
  
  // Event components
  SUMMARY = "summary",
  LOCATION = "location",
  REMINDER = "reminder",
  
  // Modifiers
  RELATIVE = "relative",
  QUALIFIER = "qualifier",
  TIMEZONE = "timezone",
  
  // Special patterns
  HOLIDAY = "holiday",
  FUZZY_TIME = "fuzzy_time"
}

export interface Pattern {
  name: string;
  regex: RegExp;
  confidence: number;
  priority: number; // Higher priority patterns are tried first
  parse: (match: RegExpMatchArray, context: ParsingContext) => ParsedComponent | null;
  validate?: (component: ParsedComponent, context: ParsingContext) => boolean;
}

export interface ParsingContext {
  referenceDate: Date;
  timezone?: string;
  locale?: string;
  userPreferences?: Record<string, any>;
}

export interface ParserConfig {
  patterns: Pattern[];
  referenceDate?: Date;
  timezone?: string;
  locale?: string;
  userPreferences?: Record<string, any>;
} 