import { Pattern, ParsedComponent, ComponentType, ParsingContext } from '../types';

// Time parsing patterns
export const timePatterns: Pattern[] = [
  {
    name: "12-hour format with meridiem",
    regex: /\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/gi,
    confidence: 0.95,
    priority: 1,
    parse: (match, context) => {
      const hour = parseInt(match[1]);
      const minute = match[2] ? parseInt(match[2]) : 0;
      const meridiem = match[3].toLowerCase();
      
      let adjustedHour = hour;
      if (meridiem === 'pm' && hour !== 12) adjustedHour += 12;
      if (meridiem === 'am' && hour === 12) adjustedHour = 0;
      
      return {
        text: match[0],
        startIndex: match.index!,
        endIndex: match.index! + match[0].length,
        type: ComponentType.TIME,
        value: { hour: adjustedHour, minute },
        confidence: 0.95,
        metadata: { format: '12hour', meridiem }
      };
    }
  },
  
  {
    name: "24-hour format",
    regex: /\b(\d{1,2}):(\d{2})\b/g,
    confidence: 0.9,
    priority: 2,
    parse: (match, context) => {
      const hour = parseInt(match[1]);
      const minute = parseInt(match[2]);
      
      // Validate time
      if (hour > 23 || minute > 59) return null;
      
      return {
        text: match[0],
        startIndex: match.index!,
        endIndex: match.index! + match[0].length,
        type: ComponentType.TIME,
        value: { hour, minute },
        confidence: 0.9,
        metadata: { format: '24hour' }
      };
    }
  },
  
  {
    name: "Military time",
    regex: /\b(\d{4})\b/g,
    confidence: 0.85,
    priority: 3,
    parse: (match, context) => {
      const timeStr = match[1];
      const hour = parseInt(timeStr.substring(0, 2));
      const minute = parseInt(timeStr.substring(2, 4));
      
      // Validate time
      if (hour > 23 || minute > 59) return null;
      
      return {
        text: match[0],
        startIndex: match.index!,
        endIndex: match.index! + match[0].length,
        type: ComponentType.TIME,
        value: { hour, minute },
        confidence: 0.85,
        metadata: { format: 'military' }
      };
    }
  },
  
  {
    name: "Fuzzy time expressions",
    regex: /\b(noon|midnight|morning|afternoon|evening|night)\b/gi,
    confidence: 0.7,
    priority: 4,
    parse: (match, context) => {
      const timeStr = match[1].toLowerCase();
      let hour = 12;
      let minute = 0;
      
      switch (timeStr) {
        case 'noon':
          hour = 12;
          break;
        case 'midnight':
          hour = 0;
          break;
        case 'morning':
          hour = 9; // Default morning time
          break;
        case 'afternoon':
          hour = 14; // Default afternoon time
          break;
        case 'evening':
          hour = 18; // Default evening time
          break;
        case 'night':
          hour = 20; // Default night time
          break;
      }
      
      return {
        text: match[0],
        startIndex: match.index!,
        endIndex: match.index! + match[0].length,
        type: ComponentType.FUZZY_TIME,
        value: { hour, minute, original: timeStr },
        confidence: 0.7,
        metadata: { fuzzy: true, original: timeStr }
      };
    }
  }
]; 