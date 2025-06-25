import { Pattern, ParsedComponent, ComponentType, ParsingContext } from '../types';

export const datePatterns: Pattern[] = [
  {
    name: "Weekday abbreviations",
    regex: /\b(mon|tue|tues|wed|thu|thurs|fri|sat|sun)\b/i,
    confidence: 0.9,
    priority: 1,
    parse: (match, context) => {
      const weekdayMap: Record<string, number> = {
        'mon': 1, 'tue': 2, 'tues': 2, 'wed': 3, 'thu': 4, 'thurs': 4,
        'fri': 5, 'sat': 6, 'sun': 0
      };
      
      const weekday = weekdayMap[match[1].toLowerCase()];
      
      return {
        text: match[0],
        startIndex: match.index!,
        endIndex: match.index! + match[0].length,
        type: ComponentType.WEEKDAY,
        value: { weekday, name: match[1].toLowerCase() },
        confidence: 0.9,
        metadata: { relative: true }
      };
    }
  },
  
  {
    name: "Relative dates - tomorrow",
    regex: /\b(tomorrow|tom|tmr|tmrw)\b/i,
    confidence: 0.95,
    priority: 1,
    parse: (match, context) => {
      const tomorrow = new Date(context.referenceDate);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      return {
        text: match[0],
        startIndex: match.index!,
        endIndex: match.index! + match[0].length,
        type: ComponentType.DATE,
        value: { date: tomorrow, relative: 'tomorrow' },
        confidence: 0.95,
        metadata: { relative: true, offset: 1 }
      };
    }
  },
  
  {
    name: "Relative dates - in X days",
    regex: /\bin\s+(\d+)\s+days?\b/i,
    confidence: 0.9,
    priority: 2,
    parse: (match, context) => {
      const days = parseInt(match[1]);
      const targetDate = new Date(context.referenceDate);
      targetDate.setDate(targetDate.getDate() + days);
      
      return {
        text: match[0],
        startIndex: match.index!,
        endIndex: match.index! + match[0].length,
        type: ComponentType.DATE,
        value: { date: targetDate, relative: `in ${days} days` },
        confidence: 0.9,
        metadata: { relative: true, offset: days }
      };
    }
  },
  
  {
    name: "Next weekday",
    regex: /\bnext\s+(mon|tue|tues|wed|thu|thurs|fri|sat|sun)\b/i,
    confidence: 0.9,
    priority: 2,
    parse: (match, context) => {
      const weekdayMap: Record<string, number> = {
        'mon': 1, 'tue': 2, 'tues': 2, 'wed': 3, 'thu': 4, 'thurs': 4,
        'fri': 5, 'sat': 6, 'sun': 0
      };
      
      const targetWeekday = weekdayMap[match[1].toLowerCase()];
      const currentWeekday = context.referenceDate.getDay();
      
      let daysToAdd = targetWeekday - currentWeekday;
      if (daysToAdd <= 0) daysToAdd += 7;
      
      const targetDate = new Date(context.referenceDate);
      targetDate.setDate(targetDate.getDate() + daysToAdd);
      
      return {
        text: match[0],
        startIndex: match.index!,
        endIndex: match.index! + match[0].length,
        type: ComponentType.DATE,
        value: { date: targetDate, weekday: targetWeekday },
        confidence: 0.9,
        metadata: { relative: true, next: true }
      };
    }
  },
  
  {
    name: "Month names",
    regex: /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\b/i,
    confidence: 0.9,
    priority: 3,
    parse: (match, context) => {
      const monthMap: Record<string, number> = {
        'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'jun': 5,
        'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11
      };
      
      const month = monthMap[match[1].toLowerCase()];
      
      return {
        text: match[0],
        startIndex: match.index!,
        endIndex: match.index! + match[0].length,
        type: ComponentType.MONTH,
        value: { month, name: match[1].toLowerCase() },
        confidence: 0.9
      };
    }
  },
  
  {
    name: "Date with month and day",
    regex: /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+(\d{1,2})(?:st|nd|rd|th)?\b/i,
    confidence: 0.85,
    priority: 4,
    parse: (match, context) => {
      const monthMap: Record<string, number> = {
        'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'jun': 5,
        'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11
      };
      
      const month = monthMap[match[1].toLowerCase()];
      const day = parseInt(match[2]);
      const year = context.referenceDate.getFullYear();
      
      const date = new Date(year, month, day);
      
      return {
        text: match[0],
        startIndex: match.index!,
        endIndex: match.index! + match[0].length,
        type: ComponentType.DATE,
        value: { date, month, day, year },
        confidence: 0.85,
        metadata: { format: 'month_day' }
      };
    }
  }
]; 