type hour = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23;
type meridiem = "am" | "pm";

enum Meridiem {
    AM = "am",
    PM = "pm",
}

interface Pattern {
    regex: RegExp;
    confidence: number; // How much confidence we have in the returned property
    parse: (match: RegExpMatchArray) => Component;
}

enum ComponentType {
    TIME = "time",
    WEEKDAY = "weekday",
    DAY = "day",
    MONTH = "month",
    YEAR = "year",
    QUARTER = "quarter",
    SEASON = "season",
    TERM = "term",
    FISCAL_WEEK = "fiscal_week",
    HOLIDAY = "holiday",
}

class Time {
    public hour: hour;
    public minute: minute;

    constructor(hour: hour, minute: minute) {
        this.hour = hour;
        this.minute = minute;
    }
}


type ComponentValue = Component | Time | Month | Weekday | number;

abstract class Component {
    constructor(text: string, index: number, type: ComponentType, value: ComponentValue) {
        this.text = text;
        this.index = index;
        this.type = type;
        this.value = value;
    }

    patterns: Pattern[] = [];
    text: string;
    index: number;
    type: ComponentType;
    value: ComponentValue;


}


Component.prototype.extract = function(text: string): Component | undefined {
    return this.patterns?.find(
        pattern => pattern.regex.test(text)
    )?.parse(text.match(pattern.regex) ?? []);
}




class TimeComponent extends Component {

    timeComponent(match: RegExpMatchArray, value: Time): Component {
        const text = match[0];
        const index = match.index;
        const type = ComponentType.TIME;

        return ({
            text,
            index, 
            type,
            value
        } as Component);
    }

    
    patterns : Pattern[] = [
        {
            // 12am
            confidence: 1, // High confidence this is a time
            regex: /(\d{1,2})(am|pm)/,
            parse: (match) => {
                return timeComponent(match, {
                    hour: parseInt(match[1]) as hour,
                    minute: 0,
                    meridiem: match[2] as Meridiem
                });
            }
        },
        {
            // 1:00
            confidence: 1,
            regex: /(\d{1,2}):(\d{2})/,
            parse: (match) => {
                return timeComponent(match, {
                    hour: parseInt(match[1]) as hour,
                    minute: parseInt(match[2]) as minute,   
                    meridiem: Meridiem.AM
                });
            }
        },
        {
            // 1:00pm
            confidence: 1,
            regex: /(\d{1,2}):(\d{2})(am|pm)/,
            parse: (match) => {
                return timeComponent(match, {
                        hour: parseInt(match[1]) as hour,
                        minute: parseInt(match[2]) as minute,
                        meridiem: match[3] as Meridiem
                });
            }
        },
    ]
}
type minute = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48 | 49 | 50 | 51 | 52 | 53 | 54 | 55 | 56 | 57 | 58 | 59;
type day = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31;

enum Month {
    JAN = 1,
    FEB = 2,
    MAR = 3,
    APR = 4,
    MAY = 5,
    JUN = 6,
    JUL = 7,
    AUG = 8,
    SEP = 9,
    OCT = 10,
    NOV = 11,
    DEC = 12
}


enum Weekday {
    MON = 1,
    TUE = 2,
    WED = 3,
    THU = 4,
    FRI = 5,
    SAT = 6,
    SUN = 0 // use standard js numbering
}

