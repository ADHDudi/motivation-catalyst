import { describe, it, expect } from 'vitest';
import { sortActionsTodayFirst } from '../../motivationCalculator';

describe('sortActionsTodayFirst', () => {
  it('moves a "1:1"-then-"Today" pair so Today renders first', () => {
    const actions = [
      'In your next 1:1: ask your manager for one specific training in a skill that challenges you',
      'Today: write down 3 small wins from this week for yourself',
    ];

    expect(sortActionsTodayFirst(actions)).toEqual([
      'Today: write down 3 small wins from this week for yourself',
      'In your next 1:1: ask your manager for one specific training in a skill that challenges you',
    ]);
  });

  it('leaves a Today-then-1:1 pair unchanged', () => {
    const actions = [
      'Today: send one teammate a message of appreciation for something specific they did',
      'In your next team meeting: spot a quiet peer and pull them into the conversation',
    ];

    expect(sortActionsTodayFirst(actions)).toEqual(actions);
  });

  it('leaves order unchanged when neither item is a Today item', () => {
    const actions = [
      'This week: pick one task and define only the outcome — let your employee choose the \'how\'',
      'By end of week: identify one routine task you will stop reviewing with them',
    ];

    expect(sortActionsTodayFirst(actions)).toEqual(actions);
  });

  it('recognizes the Hebrew "היום:" prefix as a Today item', () => {
    const actions = [
      'בפגישה הבאה: בקש מהמנהל/ת הכשרה ספציפית אחת בנושא שמאתגר אותך',
      'היום: רשום לעצמך 3 הצלחות קטנות מהשבוע האחרון',
    ];

    expect(sortActionsTodayFirst(actions)).toEqual([
      'היום: רשום לעצמך 3 הצלחות קטנות מהשבוע האחרון',
      'בפגישה הבאה: בקש מהמנהל/ת הכשרה ספציפית אחת בנושא שמאתגר אותך',
    ]);
  });
});
