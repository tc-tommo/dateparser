import { Pattern, ParsedComponent, ComponentType, ParsingContext } from '../types';

export const recurrencePatterns: Pattern[] = [
  {
    name: "Every weekday",
    regex: /\bevery\s+(mon|tue|tues|wed|thu|thurs|fri|sat|sun)\b/i,
    confidence: 0.9,
    priority: 1,
    parse: (match, context) => {
      const weekdayMap: Record<string, string> = {
        'mon': 'MO', 'tue': 'TU', 'tues': 'TU', 'wed': 'WE', 'thu': 'TH', 'thurs': 'TH',
        'fri': 'FR', 'sat': 'SA', 'sun': 'SU'
      };
      
      const weekday = weekdayMap[match[1].toLowerCase()];
      
      return {
        text: match[0],
        startIndex: match.index!,
        endIndex: match.index! + match[0].length,
        type: ComponentType.RECURRENCE,
        value: {
          frequency: 'WEEKLY',
          byDay: [weekday],
          interval: 1
        },
        confidence: 0.9,
        metadata: { pattern: 'every_weekday' }
      };
    }
  },
  
  {
    name: "Every other pattern",
    regex: /\bevery\s+other\s+(mon|tue|tues|wed|thu|thurs|fri|sat|sun)\b/i,
    confidence: 0.9,
    priority: 2,
    parse: (match, context) => {
      const weekdayMap: Record<string, string> = {
        'mon': 'MO', 'tue': 'TU', 'tues': 'TU', 'wed': 'WE', 'thu': 'TH', 'thurs': 'TH',
        'fri': 'FR', 'sat': 'SA', 'sun': 'SU'
      };
      
      const weekday = weekdayMap[match[1].toLowerCase()];
      
      return {
        text: match[0],
        startIndex: match.index!,
        endIndex: match.index! + match[0].length,
        type: ComponentType.RECURRENCE,
        value: {
          frequency: 'WEEKLY',
          byDay: [weekday],
          interval: 2
        },
        confidence: 0.9,
        metadata: { pattern: 'every_other' }
      };
    }
  },
  
  {
    name: "Daily frequency",
    regex: /\b(daily|every\s+day)\b/i,
    confidence: 0.95,
    priority: 1,
    parse: (match, context) => {
      return {
        text: match[0],
        startIndex: match.index!,
        endIndex: match.index! + match[0].length,
        type: ComponentType.RECURRENCE,
        value: {
          frequency: 'DAILY',
          interval: 1
        },
        confidence: 0.95,
        metadata: { pattern: 'daily' }
      };
    }
  },
  
  {
    name: "Weekly frequency",
    regex: /\b(weekly|every\s+week)\b/i,
    confidence: 0.95,
    priority: 1,
    parse: (match, context) => {
      return {
        text: match[0],
        startIndex: match.index!,
        endIndex: match.index! + match[0].length,
        type: ComponentType.RECURRENCE,
        value: {
          frequency: 'WEEKLY',
          interval: 1
        },
        confidence: 0.95,
        metadata: { pattern: 'weekly' }
      };
    }
  },
  
  {
    name: "Monthly frequency",
    regex: /\b(monthly|every\s+month)\b/i,
    confidence: 0.95,
    priority: 1,
    parse: (match, context) => {
      return {
        text: match[0],
        startIndex: match.index!,
        endIndex: match.index! + match[0].length,
        type: ComponentType.RECURRENCE,
        value: {
          frequency: 'MONTHLY',
          interval: 1
        },
        confidence: 0.95,
        metadata: { pattern: 'monthly' }
      };
    }
  },
  
  {
    name: "Multiple weekdays",
    regex: /\b(mon|tue|tues|wed|thu|thurs|fri|sat|sun)(?:\s*,\s*(mon|tue|tues|wed|thu|thurs|fri|sat|sun))+\b/i,
    confidence: 0.8,
    priority: 3,
    parse: (match, context) => {
      const weekdayMap: Record<string, string> = {
        'mon': 'MO', 'tue': 'TU', 'tues': 'TU', 'wed': 'WE', 'thu': 'TH', 'thurs': 'TH',
        'fri': 'FR', 'sat': 'SA', 'sun': 'SU'
      };
      
      const weekdays = match[0].split(/[,\s]+/).map(day => weekdayMap[day.toLowerCase()]);
      
      return {
        text: match[0],
        startIndex: match.index!,
        endIndex: match.index! + match[0].length,
        type: ComponentType.RECURRENCE,
        value: {
          frequency: 'WEEKLY',
          byDay: weekdays,
          interval: 1
        },
        confidence: 0.8,
        metadata: { pattern: 'multiple_weekdays' }
      };
    }
  }
]; 