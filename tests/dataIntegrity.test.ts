import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { Question } from '../src/types/question';

describe('Data Integrity (questions.json)', () => {
  const jsonPath = path.resolve(__dirname, '../public/data/questions.json');
  const rawData = fs.readFileSync(jsonPath, 'utf-8');
  const questions: Question[] = JSON.parse(rawData);

  it('contains exactly 343 questions', () => {
    expect(questions.length).toBe(343);
  });

  it('has unique question IDs without duplicates', () => {
    const idSet = new Set(questions.map(q => q.id));
    expect(idSet.size).toBe(343);
  });

  it('ensures each question has matching options in VI and EN', () => {
    questions.forEach(q => {
      expect(q.options.vi.length).toBeGreaterThan(1);
      expect(q.options.vi.length).toBe(q.options.en.length);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(q.options.vi.length);
    });
  });

  it('ensures category, question, and explanation exist in both languages', () => {
    questions.forEach(q => {
      expect(q.category.vi.trim().length).toBeGreaterThan(0);
      expect(q.category.en.trim().length).toBeGreaterThan(0);
      expect(q.question.vi.trim().length).toBeGreaterThan(0);
      expect(q.question.en.trim().length).toBeGreaterThan(0);
      expect(q.explanation.vi.trim().length).toBeGreaterThan(0);
      expect(q.explanation.en.trim().length).toBeGreaterThan(0);
    });
  });

  it('ensures English questions and options do not contain untranslated Vietnamese characters', () => {
    const vietChars = new Set('àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ');
    
    questions.forEach(q => {
      const qEnChars = Array.from(q.question.en.toLowerCase());
      const hasVietInQ = qEnChars.some(c => vietChars.has(c));
      expect(hasVietInQ, `Question ID ${q.id} has untranslated Vietnamese in question.en`).toBe(false);

      q.options.en.forEach((opt, idx) => {
        const optChars = Array.from(opt.toLowerCase());
        const hasVietInOpt = optChars.some(c => vietChars.has(c));
        expect(hasVietInOpt, `Question ID ${q.id} option ${idx} has untranslated Vietnamese in options.en`).toBe(false);
      });
    });
  });

  it('verifies all image references exist on disk', () => {
    const imageQuestions = questions.filter(q => q.image);
    expect(imageQuestions.length).toBe(77);

    imageQuestions.forEach(q => {
      const imgPath = path.resolve(__dirname, '../public', q.image!);
      expect(fs.existsSync(imgPath)).toBe(true);
    });
  });
});
