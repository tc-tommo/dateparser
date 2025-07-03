import { 
  ParsedPhrase, 
  ParsedComponent, 
  Pattern, 
  ParsingContext, 
  ParserConfig,
  ComponentType 
} from './types';
import { timePatterns } from './patterns/time-patterns';
import { datePatterns } from './patterns/date-patterns';
import { recurrencePatterns } from './patterns/recurrence-patterns';
import { intervalPatterns } from './patterns/interval-patterns';

export class NaturalLanguageParser {
  private patterns: Pattern[];
  private context: ParsingContext;

  constructor(config: ParserConfig) {
    // Combine all patterns and sort by priority (highest first)
    this.patterns = [
      ...timePatterns,
      ...datePatterns,
      ...recurrencePatterns,
      ...intervalPatterns,
      ...(config.patterns || [])
    ].sort((a, b) => b.priority - a.priority);

    this.context = {
      referenceDate: config.referenceDate || new Date(),
      timezone: config.timezone,
      locale: config.locale || 'en-US',
      userPreferences: config.userPreferences
    };
  }

  /**
   * Parse a natural language phrase into structured components
   */
    /**
   * Parse a natural language phrase into structured components
   */
    parse(text: string): ParsedPhrase {
      const components: ParsedComponent[] = [];
      let remainingText = text;
      let currentIndex = 0;
  
      // First pass: extract all possible components
      const allMatches: Array<{
        component: ParsedComponent;
        pattern: Pattern;
        match: RegExpMatchArray;
      }> = [];
  
      for (const pattern of this.patterns) {
        const matches = Array.from(
          remainingText.matchAll(pattern.regex)
        );
  
        for (const match of matches) {
          const component = pattern.parse(match, this.context);
          if (component) {
            allMatches.push({
              component: {
                ...component,
                startIndex: currentIndex + match.index!,
                endIndex: currentIndex + match.index! + match[0].length
              },
              pattern,
              match
            });
          }
        }
      }
  
      // Sort matches by priority (highest first), then confidence, then position
      allMatches.sort((a, b) => {
        // First sort by pattern priority (highest first)
        if (a.pattern.priority !== b.pattern.priority) {
          return b.pattern.priority - a.pattern.priority;
        }
        // Then by confidence (highest first)
        if (Math.abs(a.component.confidence - b.component.confidence) > 0.1) {
          return b.component.confidence - a.component.confidence;
        }
        // Finally by position in text (earliest first)
        return a.component.startIndex - b.component.startIndex;
      });
  
      // Second pass: include all matches, allowing overlaps
      // The component selection logic will handle multiple matches of the same type
      for (const { component } of allMatches) {
        components.push(component);
      }
  
      // Sort components by position in text for final output
      components.sort((a, b) => a.startIndex - b.startIndex);
  
      return {
        originalText: text,
        components,
        referenceDate: this.context.referenceDate
      };
    }

  /**
   * Extract specific component types from parsed phrase
   */
  getComponentsByType(phrase: ParsedPhrase, type: ComponentType): ParsedComponent[] {
    return phrase.components.filter(component => component.type === type);
  }

  /**
   * Get the most confident component of a specific type
   */
  getBestComponent(phrase: ParsedPhrase, type: ComponentType): ParsedComponent | null {
    const components = this.getComponentsByType(phrase, type);
    if (components.length === 0) return null;
    
    return components.reduce((best, current) => 
      current.confidence > best.confidence ? current : best
    );
  }

  /**
   * Validate that all required components are present
   */
  validatePhrase(phrase: ParsedPhrase): {
    isValid: boolean;
    missing: ComponentType[];
    warnings: string[];
  } {
    const warnings: string[] = [];
    const missing: ComponentType[] = [];
    
    // Check for required components (at least one time or date)
    const hasTime = this.getComponentsByType(phrase, ComponentType.TIME).length > 0;
    const hasDate = this.getComponentsByType(phrase, ComponentType.DATE).length > 0;
    const hasWeekday = this.getComponentsByType(phrase, ComponentType.WEEKDAY).length > 0;
    
    if (!hasTime && !hasDate && !hasWeekday) {
      missing.push(ComponentType.TIME, ComponentType.DATE);
      warnings.push("No temporal reference found");
    }

    // Check for conflicting components
    const timeComponents = this.getComponentsByType(phrase, ComponentType.TIME);
    if (timeComponents.length > 1) {
      warnings.push("Multiple time components found - may be ambiguous");
    }

    return {
      isValid: missing.length === 0,
      missing,
      warnings
    };
  }

  /**
   * Update the parsing context (useful for relative date calculations)
   */
  updateContext(newContext: Partial<ParsingContext>): void {
    this.context = { ...this.context, ...newContext };
  }
} 