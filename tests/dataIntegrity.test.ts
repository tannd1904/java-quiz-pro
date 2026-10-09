import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { Question } from '../src/types/question';

describe('Data Integrity (questions.json)', () => {
  const jsonPath = path.resolve(__dirname, '../public/data/questions.json');
  const rawData = fs.readFileSync(jsonPath, 'utf-8');
  const questions: Question[] = JSON.parse(rawData);

  it('contains at least 505 unique questions (currently 572)', () => {
    expect(questions.length).toBe(572);
  });

  it('has unique question IDs without duplicates', () => {
    const idSet = new Set(questions.map(q => q.id));
    expect(idSet.size).toBe(572);
  });

  it('ensures no duplicate questions exist in the bank', () => {
    const questionFingerprints = new Set(
      questions.map(
        q =>
          `${q.type || 'SINGLE'}|${q.question.vi.trim().toLowerCase()}|${q.options.vi.join('|')}|${q.correctIndex}|${(q.correctIndices || []).join(',')}|${(q.acceptedAnswers || []).join(',')}|${q.image || ''}|${q.codeSnippet || ''}`
      )
    );
    expect(questionFingerprints.size).toBe(572);
  });

  it('ensures all topics are represented with valid questions', () => {
    const topicCounts = questions.reduce((acc, q) => {
      acc[q.topicId] = (acc[q.topicId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    expect(topicCounts['objects_classes'] || 0).toBeGreaterThanOrEqual(90);
    const oop4Count =
      (topicCounts['encapsulation'] || 0) +
      (topicCounts['inheritance'] || 0) +
      (topicCounts['polymorphism'] || 0) +
      (topicCounts['abstraction'] || 0);
    expect(oop4Count).toBeGreaterThanOrEqual(100);
    expect(topicCounts['interface'] || 0).toBeGreaterThanOrEqual(30);
    expect(topicCounts['exception'] || 0).toBeGreaterThanOrEqual(30);
    expect(topicCounts['lambda'] || 0).toBeGreaterThanOrEqual(10);
    expect(topicCounts['inner_class'] || 0).toBeGreaterThanOrEqual(10);
  });

  it('ensures each question has valid answer setup in VI and EN', () => {
    questions.forEach(q => {
      if (q.type === 'FILL_BLANK') {
        expect((q.acceptedAnswers || []).length).toBeGreaterThan(0);
        return;
      }
      expect(q.options.vi.length).toBeGreaterThan(1);
      expect(q.options.vi.length).toBe(q.options.en.length);
      if (q.type === 'MULTIPLE_CHOICE') {
        expect((q.correctIndices || []).length).toBeGreaterThan(1);
      } else {
        expect(q.correctIndex).toBeGreaterThanOrEqual(0);
        expect(q.correctIndex).toBeLessThan(q.options.vi.length);
      }
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

  it('verifies presence and integrity of new question formats (MULTIPLE_CHOICE, FILL_BLANK, TRUE_FALSE)', () => {
    const multi = questions.filter(q => q.type === 'MULTIPLE_CHOICE');
    const fill = questions.filter(q => q.type === 'FILL_BLANK');
    const tf = questions.filter(q => q.type === 'TRUE_FALSE');

    expect(multi.length).toBeGreaterThanOrEqual(25);
    expect(fill.length).toBeGreaterThanOrEqual(25);
    expect(tf.length).toBeGreaterThanOrEqual(20);
  });

  it('verifies all image references exist on disk', () => {
    const imageQuestions = questions.filter(q => q.image);
    expect(imageQuestions.length).toBe(68);

    imageQuestions.forEach(q => {
      const imgPath = path.resolve(__dirname, '../public', q.image!);
      expect(fs.existsSync(imgPath)).toBe(true);
    });
  });

  it('ensures fill-in-the-blank placeholders do not reveal hints or answers', () => {
    const fillQuestions = questions.filter(q => q.type === 'FILL_BLANK');
    expect(fillQuestions.length).toBeGreaterThan(0);
    fillQuestions.forEach(q => {
      const phVi = (q.blankPlaceholder?.vi || '').toLowerCase();
      const phEn = (q.blankPlaceholder?.en || '').toLowerCase();
      expect(phVi.includes('ví dụ')).toBe(false);
      expect(phEn.includes('e.g.')).toBe(false);
    });
  });
});

