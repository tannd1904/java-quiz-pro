import { Question, Language } from '../types/question';
import { ExamSetupConfig, ExamQuestionItem, ExamResult, ExamReviewItem } from '../types/quiz';
import { APP_CONFIG } from '../config/app.config';

export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function filterQuestionsByTopics(questions: Question[], topicIds: string[]): Question[] {
  if (!topicIds || topicIds.length === 0) return [];
  return questions.filter(q => topicIds.includes(q.topicId));
}

export function searchQuestions(
  questions: Question[],
  query: string,
  lang: Language
): Question[] {
  const qClean = (query || '').toLowerCase().trim();
  if (!qClean) return questions;

  return questions.filter(q => {
    const qText = (q.question[lang] || q.question.vi || '').toLowerCase();
    const cSnippet = (q.codeSnippet || '').toLowerCase();
    const exp = (q.explanation[lang] || q.explanation.vi || '').toLowerCase();
    const cat = (q.category[lang] || q.category.vi || '').toLowerCase();
    const opts = (q.options[lang] || q.options.vi || []).some(opt =>
      opt.toLowerCase().includes(qClean)
    );

    return (
      qText.includes(qClean) ||
      cSnippet.includes(qClean) ||
      exp.includes(qClean) ||
      cat.includes(qClean) ||
      opts
    );
  });
}

export function prepareExamSession(
  allQuestions: Question[],
  config: ExamSetupConfig
): ExamQuestionItem[] {
  // 1. Filter pool by topics
  let pool = filterQuestionsByTopics(allQuestions, config.selectedTopicIds);
  if (pool.length === 0) return [];

  // 2. Slice count with balanced representation for new question types
  const parsedCount = Number(config.questionCount);
  const count = Number.isFinite(parsedCount) && parsedCount > 0 ? Math.min(parsedCount, pool.length) : pool.length;

  let selected: Question[] = [];
  const specialPool = pool.filter(q => q.type && q.type !== 'SINGLE_CHOICE');
  const standardPool = pool.filter(q => !q.type || q.type === 'SINGLE_CHOICE');

  if (specialPool.length > 0 && count < pool.length) {
    // Ensure ~35% of exam questions come from the new formats (MULTIPLE_CHOICE, FILL_BLANK, TRUE_FALSE)
    const targetSpecial = Math.min(specialPool.length, Math.max(1, Math.round(count * 0.35)));
    const targetStandard = count - targetSpecial;

    const sampledSpecial = config.shuffleQuestions ? shuffleArray(specialPool) : specialPool;
    const sampledStandard = config.shuffleQuestions ? shuffleArray(standardPool) : standardPool;

    selected = [
      ...sampledSpecial.slice(0, targetSpecial),
      ...sampledStandard.slice(0, targetStandard)
    ];

    if (config.shuffleQuestions) {
      selected = shuffleArray(selected);
    }
  } else {
    const shuffled = config.shuffleQuestions ? shuffleArray(pool) : pool;
    selected = shuffled.slice(0, count);
  }

  // 4. Map questions with option indices (supporting option shuffle)
  return selected.map(q => {
    const originalOptionCount = q.options?.vi?.length || 0;
    let indices = Array.from({ length: originalOptionCount }, (_, i) => i);

    if (config.shuffleOptions && originalOptionCount > 1 && q.type !== 'TRUE_FALSE') {
      indices = shuffleArray(indices);
    }

    return {
      question: q,
      shuffledIndices: indices,
      originalCorrectIndex: q.correctIndex,
      originalCorrectIndices: q.correctIndices,
    };
  });
}

export function evaluateUserAnswer(
  item: ExamQuestionItem,
  rawAnswer: any
): { isAnswered: boolean; isCorrect: boolean } {
  const q = item.question;
  const qType = q.type || 'SINGLE_CHOICE';

  if (rawAnswer === undefined || rawAnswer === null) {
    return { isAnswered: false, isCorrect: false };
  }

  if (qType === 'FILL_BLANK') {
    const text = String(rawAnswer).trim();
    if (!text) return { isAnswered: false, isCorrect: false };
    const accepted = (q.acceptedAnswers || []).map(a => a.trim().toLowerCase());
    const isCorrect = accepted.includes(text.toLowerCase());
    return { isAnswered: true, isCorrect };
  }

  if (qType === 'MULTIPLE_CHOICE') {
    if (!Array.isArray(rawAnswer) || rawAnswer.length === 0) {
      return { isAnswered: false, isCorrect: false };
    }
    const selectedOriginal = rawAnswer.map((sIdx: number) => item.shuffledIndices[sIdx]);
    const expected = [...(q.correctIndices || [])].sort((a, b) => a - b);
    const actual = [...selectedOriginal].sort((a, b) => a - b);
    const isCorrect =
      expected.length === actual.length && expected.every((val, idx) => val === actual[idx]);
    return { isAnswered: true, isCorrect };
  }

  // SINGLE_CHOICE or TRUE_FALSE
  if (typeof rawAnswer !== 'number') {
    return { isAnswered: false, isCorrect: false };
  }
  const selectedOriginal = item.shuffledIndices[rawAnswer];
  const isCorrect = selectedOriginal === q.correctIndex;
  return { isAnswered: true, isCorrect };
}

export function calculateExamResult(
  examItems: ExamQuestionItem[],
  answers: Record<string, any>,
  totalTimeSeconds: number,
  remainingSeconds: number,
  selectedTopicIds: string[]
): ExamResult {
  let correctCount = 0;
  let wrongCount = 0;
  let skippedCount = 0;

  const reviewList: ExamReviewItem[] = examItems.map((item, idx) => {
    const rawAnswer = answers[item.question.id];
    const { isAnswered, isCorrect } = evaluateUserAnswer(item, rawAnswer);

    let selectedShuffledIndex: number | null = null;
    let selectedOriginalIndex: number | null = null;
    let selectedOriginalIndices: number[] | undefined = undefined;

    if (!isAnswered) {
      skippedCount++;
    } else {
      if (isCorrect) {
        correctCount++;
      } else {
        wrongCount++;
      }

      if (typeof rawAnswer === 'number') {
        selectedShuffledIndex = rawAnswer;
        selectedOriginalIndex = item.shuffledIndices[rawAnswer];
      } else if (Array.isArray(rawAnswer)) {
        selectedOriginalIndices = rawAnswer.map((sIdx: number) => item.shuffledIndices[sIdx]);
      }
    }

    return {
      num: idx + 1,
      question: item.question,
      userAnswer: isAnswered ? rawAnswer : null,
      selectedShuffledIndex,
      selectedOriginalIndex,
      selectedOriginalIndices,
      correctOriginalIndex: item.question.correctIndex,
      correctOriginalIndices: item.question.correctIndices,
      acceptedAnswers: item.question.acceptedAnswers,
      isCorrect,
    };
  });

  const total = examItems.length;
  const score10 = total > 0 ? Number(((correctCount / total) * 10).toFixed(1)) : 0;
  const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  const isPassed = percentage >= APP_CONFIG.PASSING_SCORE_PERCENT;

  const timeSpentSeconds = Math.max(0, totalTimeSeconds - remainingSeconds);
  const spentMins = Math.floor(timeSpentSeconds / 60);
  const spentSecs = timeSpentSeconds % 60;
  const timeSpentFormatted = `${spentMins}m ${spentSecs.toString().padStart(2, '0')}s`;

  return {
    total,
    correctCount,
    wrongCount,
    skippedCount,
    score10,
    percentage,
    isPassed,
    timeSpentSeconds,
    timeSpentFormatted,
    reviewList,
    selectedTopicIds
  };
}
