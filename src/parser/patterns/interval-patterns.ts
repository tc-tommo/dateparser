import { ComponentType, Pattern } from "../types";

export const intervalPatterns: Pattern[] = [
  {
    name: "Time range with 'to'",
    regex: /\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\s+to\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b/gi,
    confidence: 0.9,
    priority: 1, // Higher priority than individual time patterns
    parse: (match, context) => {
      const startHour = parseInt(match[1]);
      const startMinute = match[2] ? parseInt(match[2]) : 0;
      const startMeridiem = match[3]?.toLowerCase();
      const endHour = parseInt(match[4]);
      const endMinute = match[5] ? parseInt(match[5]) : 0;
      const endMeridiem = match[6]?.toLowerCase();
      
      // Convert to 24-hour format
      let adjustedStartHour = startHour;
      let adjustedEndHour = endHour;
      
      if (startMeridiem) {
        if (startMeridiem === 'pm' && startHour !== 12) adjustedStartHour += 12;
        if (startMeridiem === 'am' && startHour === 12) adjustedStartHour = 0;
      }
      
      if (endMeridiem) {
        if (endMeridiem === 'pm' && endHour !== 12) adjustedEndHour += 12;
        if (endMeridiem === 'am' && endHour === 12) adjustedEndHour = 0;
      } else if (startMeridiem) {
        // If end doesn't have meridiem but start does, infer from start
        if (startMeridiem === 'pm' && endHour < startHour) adjustedEndHour += 12;
      }
      
      // Validate times
      if (adjustedStartHour > 23 || adjustedEndHour > 23 || startMinute > 59 || endMinute > 59) {
        return null;
      }
      
      return {
        text: match[0],
        startIndex: match.index!,
        endIndex: match.index! + match[0].length,
        type: ComponentType.INTERVAL,
        value: {
          start: { hour: adjustedStartHour, minute: startMinute },
          end: { hour: adjustedEndHour, minute: endMinute }
        },
        confidence: 0.9,
        metadata: { 
          format: 'range_with_to',
          startMeridiem,
          endMeridiem
        }
      };
    }
  },
  
  {
    name: "Time range with hyphen",
    regex: /\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\s*-\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b/gi,
    confidence: 0.9,
    priority: 1, // Higher priority than individual time patterns
    parse: (match, context) => {
      const startHour = parseInt(match[1]);
      const startMinute = match[2] ? parseInt(match[2]) : 0;
      const startMeridiem = match[3]?.toLowerCase();
      const endHour = parseInt(match[4]);
      const endMinute = match[5] ? parseInt(match[5]) : 0;
      const endMeridiem = match[6]?.toLowerCase();
      
      // Convert to 24-hour format
      let adjustedStartHour = startHour;
      let adjustedEndHour = endHour;
      
      if (startMeridiem) {
        if (startMeridiem === 'pm' && startHour !== 12) adjustedStartHour += 12;
        if (startMeridiem === 'am' && startHour === 12) adjustedStartHour = 0;
      }
      
      if (endMeridiem) {
        if (endMeridiem === 'pm' && endHour !== 12) adjustedEndHour += 12;
        if (endMeridiem === 'am' && endHour === 12) adjustedEndHour = 0;
      } else if (startMeridiem) {
        // If end doesn't have meridiem but start does, infer from start
        if (startMeridiem === 'pm' && endHour < startHour) adjustedEndHour += 12;
      }
      
      // Validate times
      if (adjustedStartHour > 23 || adjustedEndHour > 23 || startMinute > 59 || endMinute > 59) {
        return null;
      }
      
      return {
        text: match[0],
        startIndex: match.index!,
        endIndex: match.index! + match[0].length,
        type: ComponentType.INTERVAL,
        value: {
          start: { hour: adjustedStartHour, minute: startMinute },
          end: { hour: adjustedEndHour, minute: endMinute }
        },
        confidence: 0.9,
        metadata: { 
          format: 'range_with_hyphen',
          startMeridiem,
          endMeridiem
        }
      };
    }
  }
];