# Scheduling Phrases - Taxonomy
The following is as near a comprehensive list of supportable expressions for the model to understand to accurately transcribe iCalendar format.

## Supported Functionality
- Timezone support
- Recurrence patterns
- Duration patterns
- Interval/bounding patterns
- Concrete and (some) fuzzy vocabulary
- Format variations
- Reminder patterns

## Semantic Patterns (Structural Elements)
### Temporal Relationships
- Relative dating: "in 2 days", "next tuesday", "first mon of feb", "last friday of the month"
- Concrete dating: "12/06", "3rd june", "june 3rd"
- Duration patterns: "for 1hr", "1.5hrs", "3hrs", "20mins"
- Interval patterns: "from 6pm til 8:30pm", "3-5pm", "between 3 and 4", "all day"
- Recurrence structures:
  - Base frequency: "every mon", "hourly", "mondays"
  - Modifiers: "every other sat", "every third fri", "every 15th"
  - Compound: "mon, thu & saturdays", "every mon thu sat"
- Exception patterns: "except", "excluding", "unless", "minus"
- Timezone context: "8pm EST", "GMT+1 1200", "4pm madrid time"

## Terminology & Vocabulary
### Temporal References
- Days: "mon", "tues", "wk", "weekdays" 
- Time: "hr", "min", "noon", "midnight"
- Date: "Q1", "1st", "last", "of"
- Holidays: "christmas", "NYE", "halloween"
- Qualifiers: "before", "after", "from", "until"

### Format Variants
- Time formats: 
  - "10am", "1000", "10:00", "6 past 2"
  - "quarter past", "half past", "14.06"
- Date formats:
  - "12/06", "12-06", "12.06"
  - "june 3rd", "third of june"

### Fuzzy Concepts
- Times of day: "morning", "afternoon", "evening"
- Relative periods: "soon", "later", "in a while"
- Seasonals: "solstice", "fiscal week", "sem1"

### Shorthand & Abbreviations, Specific terminology
- Temporal: "tom" (tomorrow), "til" (until), "mo" (month)
- Holiday: "NYE" (New Year's Eve), "Xmas" (Christmas)
- Business: "FY25" (Fiscal Year 2025)
#### Extension: Personal context dependent
- "sem1 week 5"
- "term start"
- "5th fiscal week"

## Time Patterns and relative dates
- "mon 10am", "monday 10am", "1000 mon", "10:00 monday"
 > immediate monday from reference date
- "next tuesday 3pm"
 > following tuesday (+1 week +n days) from reference date
- "next week friday 445pm"
 > following friday from reference date
- "in 2 days", "in 2 days time", "2d from now", "in 2d"
- "in {x} days": days=REF+x
 > 2 days from reference date
- "tomorrow at 4pm", "tomorrow 4pm", "tom 4pm", "tmr 4pm", "tmrw 4pm", "in 1d 4pm"
 > immediate following day from reference date
- "first mon of feb", "1st mon of feb", "1st mon feb"
 > first monday of february from reference date
- "last friday of the month"
 > last friday of the month from reference date

## Date and time formats
- Format variations: "12/06", "12-06", "12.06", "206pm", "1406", "14:06", "6 past 2"
- Ordinal variations: "june 3rd", "june 3", "3rd june", "third of june"


## Concrete and fuzzy vocabulary
- "noon", "midnight", "morning", "afternoon", "evening", "quarter past", "half past"
- "christmas", "new years eve", "NYE", "halloween", "easter", "solstice"
- "Q1", "Q2", "Q3", "Q4"

## Lazy vocabulary and shorthand
- "mon", "tom", "til", "wk", "hr", "min", "m"

## Alternative vocabulary
- "before", "prior"
- "every", "each"
- "on", "at"
- "from", "til", "until"
- "between _ and _", "from _ to _"
- "for"
- "during", "of"
- "except", "excluding", "minus", "unless", "apart from", "other than", "but", "not", "bar"
- "weekly", "monthly", "yearly"


## Recurrent patterns
- "every mon", "every other sat", "every third fri", "every 15th", "every 20 minutes"
- "every week"
- "hourly", "daily", "weekly", "monthly", "yearly"
- "mondays", "on mondays"
- "mon, thu & saturdays", "every mon thu sat", "on mon, thu & sat every week"

## Duration patterns
- "for 1hr", "1.5hrs", "3hrs", "20mins"

## Interval/bounding patterns
- "from 6pm til 8:30pm wed"
- "from 3 to 4"
- "between 3 and 4"
- "3-5pm"
- "until 6pm"

## Reminder patterns - distinguishing from a time expression could prove challenging
- "remind me in 2 days"
- "remind me 20mins before"

## Excepting patterns
- "every tues unless 1st week of month"
- "every weekday feb except feb 14 to 18"
- "hourly from 9 to 5 except 12pm"
- "weekdays minus thurs"


## Compound expressions (generate with input complication)
- "every mon 9am"
- "1 week on friday at 2"
- "2 days from now repeating every week"
- "3 jan 2pm for 1hr"
- "15 past the hour every hour from 9-5 weekdays"
- "every 2 days from today except last 2 weeks of feb"
- "weekly on friday from 18 jun til 20 oct"
- "every 2 days for 10 weeks"
- "3pm tuesdays for 2mo"
- "every 2nd weekday after jul 1st"

## Timezone patterns
- "8pm EST"
- "2pm chile time"
- "GMT+1 1200"
- "4pm madrid time"
- "1745+0800"

## Advanced: Personal context dependent
- "sem1 week 5"
- "term start"
- "5th fiscal week"
- "FY25"

# Possible Issues
- Too much ambiguity permitted: "from 6 to 9" (is this 6am to 9am? 6 to 9th of august? may be hard to decide from the context)

Example set:
```
every mon 9am
fri 3pm rem 15 mins before
every other sat 10-12pm
thurs 1:30pm 1.5hrs
wed 1-4pm 3hrs
every third fri 4pm rem 1hr before
sat 10am re 20 mins before
wed 1-4pm 3hrs
10am 20mins
1st mon 6:30pm
from 6pm til 8:30pm wed
daily 8am
3 jan 2pm 1hr
last mon feb 10am
every 15th 8am
aug 9th 7pm remind me 1hr
2-3:30pm last fri of month
tom noon
tmrw 3pm
15min before thurs 7pm
mon 5
next mon 10a-12p
wkly 7pm mon
thurs 7pm until 9
every fri 5pm-7pm
tues 9a until 11
nov 29 1800
every wed 14.00-15.30
15th 20.45-22.15
dec 24 1300-1500
last sun feb 0800 2hrs
every mon 9am
fri 3pm rem 15 mins before
every other sat 10-12pm
thurs 1:30pm 1.5hrs
every tues 11am 30mins
sun 9am-12pm 3hrs
every third fri 4pm rem 1hr before
next wed 3pm 1hr
next jul 4 7pm
halloween 6pm
christmas morning
10am 20mins
1st mon 6:30pm
2-3:30pm last fri of month
tmrw 3pm
wkly 7pm mon
12/06
from 6pm til 8:30pm wed
3 jan 2pm 1hr
last fri of june re 1pm
last mon feb 10am
aug 9th 7pm remind me 1hr
nov 29 1800
in 2 days 2pm
in 4hrs
in 10m
every mon 0700 45mins
remind me 20mins 3 jan 16:00
every wed 14.00-15.30
fri night 8pm till 10:30
every tues unless 1st week of month
daily except feb 14 to 18
every 20 minutes from 3 to 4
```

## Coverage
✅ Multi-format time representations  
✅ Absolute/relative dating  
✅ Holiday references  
✅ Implicit vs explicit duration models  
✅ Regional formatting variations
✅ Recurrence patterns
✅ Duration patterns
✅ Interval/bounding patterns
✅ Reminder patterns
✅ Excepting patterns
✅ Compound expressions
✅ Timezone qualifiers



# Training data format - Tagged iCal information


## Single event
```iCalendar
BEGIN:VCALENDAR
INPUT: every tue 3-5pm MLP Tutorial rem 15m before
LANGUAGE:en-GB
REFDATE:Wednesday 2025-02-12 1232
VERSION:2.0
PRODID:-//ical-taxonomy//0.1//EN
BEGIN:VEVENT
UID:12378
SEQUENCE:0
DTSTAMP:20250212T123200
SUMMARY:MLP Tutorial
DESCRIPTION:Weekly MLP Tutorial
RRULE:FREQ=WEEKLY;BYDAY=TU
DTSTART:20250218T150000
DTEND:20250218T170000
LOCATION:AT_3.12
BEGIN:VALARM
TRIGGER:-PT15M
ACTION:DISPLAY
END:VALARM
END:VEVENT
END:VCALENDAR 
```

## Multi-event
```iCalendar
BEGIN:VCALENDAR
INPUT: Coding Camp Workshop monday 12-2 and next tuesday 10-12
LANGUAGE:en-GB
REFDATE:Wednesday 2025-02-12 1232
VERSION:2.0
PRODID:-//BERTiCal//0.1//EN
BEGIN:VEVENT
UID:12378
SEQUENCE:0
DTSTAMP:20250212T123200
SUMMARY:Coding Camp Workshop
DESCRIPTION:Coding Camp Workshop
DTSTART:20250218T120000
DTEND:20250218T140000
END:VEVENT
BEGIN:VEVENT
UID:12379
SEQUENCE:1
DTSTAMP:20250212T123200
SUMMARY:Coding Camp Workshop
DESCRIPTION:Coding Camp Workshop
DTSTART:20250225T100000
DTEND:20250225T120000
END:VEVENT
END:VCALENDAR
```
