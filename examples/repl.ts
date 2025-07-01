#!/usr/bin/env ts-node

import * as readline from 'readline';
import { DateParser } from '../src/index';
import { ParserConfig } from '../src/parser/types';

class DateParserREPL {
  private parser: DateParser;
  private config: ParserConfig;
  private rl: readline.Interface;
  private isRunning: boolean = false;

  constructor() {
    this.config = {
      patterns: [],
      referenceDate: new Date(),
      timezone: 'UTC',
      locale: 'en-US'
    };
    this.parser = new DateParser(this.config);
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: 'dateparser> '
    });
  }

  async start() {
    console.log('🌅 Natural Language Date Parser REPL');
    console.log('Type "help" for available commands, "exit" to quit\n');
    
    this.isRunning = true;
    this.rl.prompt();

    this.rl.on('line', (input) => {
      this.handleCommand(input.trim());
    });

    this.rl.on('close', () => {
      console.log('\n👋 Goodbye!');
      process.exit(0);
    });
  }

  private handleCommand(input: string) {
    if (!input) {
      this.rl.prompt();
      return;
    }

    const parts = input.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (command) {
      case 'help':
        this.showHelp();
        break;
      case 'exit':
      case 'quit':
        this.isRunning = false;
        this.rl.close();
        break;
      case 'parse':
        this.parseInput(args.join(' '));
        break;
      case 'details':
        this.showDetails(args.join(' '));
        break;
      case 'config':
        this.showConfig();
        break;
      case 'set':
        this.setConfig(args);
        break;
      case 'examples':
        this.showExamples();
        break;
      case 'clear':
        console.clear();
        break;
      default:
        // If no command specified, treat as parse input
        this.showDetails(input);
        this.parseInput(input);
    }

    if (this.isRunning) {
      this.rl.prompt();
    }
  }

  private parseInput(text: string) {
    if (!text) {
      console.log('❌ Please provide text to parse');
      return;
    }

    try {
      const result = this.parser.parseToCalendar(text);
      
      if (result.iCalendarEvent) {
        console.log('\n📅 iCalendar Event:');
        console.log(JSON.stringify(result.iCalendarEvent, null, 2));
        
        if (result.validation.warnings.length > 0) {
          console.log('\n⚠️  Warnings:');
          result.validation.warnings.forEach(warning => {
            console.log(`  - ${warning}`);
          });
        }
      } else {
        console.log('❌ Failed to parse');
        console.log('\n⚠️  Validation issues:');
        result.validation.warnings.forEach(warning => {
          console.log(`  - ${warning}`);
        });
      }
    } catch (error) {
      console.log('❌ Error during parsing:', error);
    }
  }

  private showDetails(text: string) {
    if (!text) {
      console.log('❌ Please provide text to analyze');
      return;
    }
    console.log('─'.repeat(50));

    try {
      const details = this.parser.getParsingDetails(text);
      
      console.log('📋 Parsed Components:');
      if (details.components && typeof details.components === 'object') {
        Object.entries(details.components).forEach(([type, components]) => {
          if (components && components.length > 0) {
            console.log(`\n  ${type}:`);
            components.forEach(component => {
              console.log(`    - "${component.text}" (confidence: ${component.confidence})`);
            });
          }
        });
      } else {
        console.log('No components found');
      }

      if (details.validation.warnings.length > 0) {
        console.log('\n⚠️  Warnings:');
        details.validation.warnings.forEach(warning => {
          console.log(`  - ${warning}`);
        });
      }
    } catch (error) {
      console.log('❌ Error during analysis:', error);
    }
  }

  private showConfig() {
    console.log('\n⚙️  Current Configuration:');
    console.log('─'.repeat(30));
    console.log(`Reference Date: ${this.config.referenceDate?.toISOString()}`);
    console.log(`Timezone: ${this.config.timezone}`);
    console.log(`Locale: ${this.config.locale}`);
    console.log(`Custom Patterns: ${this.config.patterns.length}`);
  }

  private setConfig(args: string[]) {
    if (args.length < 2) {
      console.log('❌ Usage: set <property> <value>');
      console.log('Available properties: timezone, locale, refdate');
      return;
    }

    const [property, ...valueParts] = args;
    const value = valueParts.join(' ');

    switch (property.toLowerCase()) {
      case 'timezone':
        this.config.timezone = value;
        this.parser = new DateParser(this.config);
        console.log(`✅ Timezone set to: ${value}`);
        break;
      case 'locale':
        this.config.locale = value;
        this.parser = new DateParser(this.config);
        console.log(`✅ Locale set to: ${value}`);
        break;
      case 'refdate':
        const newDate = new Date(value);
        if (isNaN(newDate.getTime())) {
          console.log('❌ Invalid date format. Use ISO format (e.g., 2024-01-15)');
          return;
        }
        this.config.referenceDate = newDate;
        this.parser = new DateParser(this.config);
        console.log(`✅ Reference date set to: ${newDate.toISOString()}`);
        break;
      default:
        console.log('❌ Unknown property. Available: timezone, locale, refdate');
    }
  }

  private showExamples() {
    console.log('\n📚 Example Phrases:');
    console.log('─'.repeat(30));
    const examples = [
      'this wed new event 10am',
      'every tue afternoon 5pm at the office',
      'wed 10am',
      'tomorrow 3pm for 1hr',
      'every mon 9am',
      'fri 3pm rem 15 mins before',
      'next tue 2pm',
      'jan 15th 3:30pm',
      'every other sat 9am',
      'mon, thu & sat 2pm'
    ];

    examples.forEach((example, index) => {
      console.log(`${index + 1}. "${example}"`);
    });
    console.log('\n💡 Try: parse "example phrase"');
  }

  private showHelp() {
    console.log('\n📖 Available Commands:');
    console.log('─'.repeat(30));
    console.log('parse <text>     - Parse natural language to iCalendar');
    console.log('details <text>   - Show detailed parsing analysis');
    console.log('config           - Show current configuration');
    console.log('set <prop> <val> - Set configuration property');
    console.log('examples         - Show example phrases');
    console.log('clear            - Clear the screen');
    console.log('help             - Show this help');
    console.log('exit/quit        - Exit the REPL');
    console.log('\n💡 You can also just type text directly to parse it!');
  }
}

// Start the REPL
const repl = new DateParserREPL();
repl.start().catch((error) => {
  console.error('REPL Error:', error);
  process.exit(1);
});
