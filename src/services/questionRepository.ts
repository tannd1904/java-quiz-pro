import { Question } from '../types/question';

class QuestionRepository {
  private cache: Question[] | null = null;
  private loadPromise: Promise<Question[]> | null = null;

  public async getQuestions(): Promise<Question[]> {
    if (this.cache) {
      return this.cache;
    }

    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.loadPromise = (async () => {
      try {
        const response = await fetch('./data/questions.json');
        if (!response.ok) {
          throw new Error(`Failed to load question bank HTTP ${response.status}`);
        }
        const data: Question[] = await response.json();
        
        // Basic schema verification
        if (!Array.isArray(data) || data.length === 0) {
          throw new Error('Question bank format is invalid or empty.');
        }

        this.cache = data;
        return data;
      } catch (err) {
        this.loadPromise = null;
        console.error('QuestionRepository load error:', err);
        throw err;
      }
    })();

    return this.loadPromise;
  }

  public getCachedQuestions(): Question[] {
    return this.cache || [];
  }
}

export const questionRepository = new QuestionRepository();
