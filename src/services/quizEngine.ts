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

  // 2. Shuffle question order if enabled
  if (config.shuffleQuestions) {
    pool = shuffleArray(pool);
  }

  // 3. Slice to desired count
  const parsedCount = Number(config.questionCount);
  const count = Number.isFinite(parsedCount) && parsedCount > 0 ? Math.min(parsedCount, pool.length) : pool.length;
  const selected = pool.slice(0, count);

  // 4. Map questions with option indices (supporting option shuffle)
  return selected.map(q => {
    const originalOptionCount = q.options.vi.length;
    let indices = Array.from({ length: originalOptionCount }, (_, i) => i);

    if (config.shuffleOptions) {
      indices = shuffleArray(indices);
    }

    return {
      question: q,
      shuffledIndices: indices,
      originalCorrectIndex: q.correctIndex
    };
  });
}

export function calculateExamResult(
  examItems: ExamQuestionItem[],
  answers: Record<string, number>, // { [questionId]: selectedShuffledIndex }
  totalTimeSeconds: number,
  remainingSeconds: number,
  selectedTopicIds: string[]
): ExamResult {
  let correctCount = 0;
  let wrongCount = 0;
  let skippedCount = 0;

  const reviewList: ExamReviewItem[] = examItems.map((item, idx) => {
    const selectedShuffledIndex = answers[item.question.id];
    const isAnswered = selectedShuffledIndex !== undefined && selectedShuffledIndex !== null;

    let selectedOriginalIndex: number | null = null;
    let isCorrect = false;

    if (!isAnswered) {
      skippedCount++;
    } else {
      selectedOriginalIndex = item.shuffledIndices[selectedShuffledIndex];
      if (selectedOriginalIndex === item.originalCorrectIndex) {
        correctCount++;
        isCorrect = true;
      } else {
        wrongCount++;
      }
    }

    return {
      num: idx + 1,
      question: item.question,
      selectedShuffledIndex: isAnswered ? selectedShuffledIndex : null,
      selectedOriginalIndex,
      correctOriginalIndex: item.originalCorrectIndex,
      isCorrect
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
