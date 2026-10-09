import { ExamResult, ExamSetupConfig } from '../types/quiz';

const STORAGE_KEY_CANDIDATE_NAME = 'java_quiz_candidate_name';
const STORAGE_KEY_DEVICE_ID = 'java_quiz_device_id';
const STORAGE_KEY_WEBHOOK = 'java_quiz_sheet_webhook_url';
const STORAGE_KEY_CACHED_IP = 'java_quiz_cached_ip';
const STORAGE_KEY_CACHED_LOC = 'java_quiz_cached_loc';

export const EVENT_CANDIDATE_NAME_UPDATED = 'java_quiz_candidate_name_updated';

// Default Google Sheets Webhook URL configured by administrator
export const DEFAULT_SHEET_WEBHOOK_URL =
  'https://script.google.com/macros/s/AKfycbyA3DfH_odzp_1N64ioXeRBZ6dt5Q0MLhdiZAm1FBd4ONn-2Ck-h97D7oeeE6isfKmp/exec';

export interface TelemetryPayload {
  timestamp: string;
  candidateName: string;
  deviceId: string;
  score10: number;
  percentage: number;
  correctCount: number;
  wrongCount: number;
  skippedCount: number;
  totalQuestions: number;
  isPassed: string;
  timeSpent: string;
  topicsSummary: string;
  wrongQuestions: string;
  skippedQuestions: string;
  ip: string;
  location: string;
  isp: string;
  device: string;
  os: string;
  browser: string;
  screen: string;
  pageUrl: string;
}

class ExamTelemetryService {
  private cachedIp: string = '';
  private cachedLocation: string = '';

  constructor() {
    if (typeof window !== 'undefined') {
      // Pre-warm / prefetch IP immediately on background load
      this.prefetchIp();
    }
  }

  /**
   * Initializes or retrieves persistent Device ID.
   */
  public getDeviceId(): string {
    if (typeof localStorage === 'undefined') return 'DEV-SERVER';
    try {
      let devId = localStorage.getItem(STORAGE_KEY_DEVICE_ID);
      if (!devId) {
        devId = `DEV-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        localStorage.setItem(STORAGE_KEY_DEVICE_ID, devId);
      }
      return devId;
    } catch {
      return 'DEV-UNKNOWN';
    }
  }

  /**
   * Gets candidate name from URL query parameter (?name= or ?user=) or localStorage.
   */
  public getCandidateName(): string {
    if (typeof localStorage === 'undefined') return '';
    try {
      // Check query parameter first if in browser
      if (typeof window !== 'undefined' && window.location?.search) {
        const params = new URLSearchParams(window.location.search);
        const urlName = params.get('name') || params.get('user') || params.get('ref');
        if (urlName && urlName.trim()) {
          const cleaned = urlName.trim();
          localStorage.setItem(STORAGE_KEY_CANDIDATE_NAME, cleaned);
          return cleaned;
        }
      }

      return (localStorage.getItem(STORAGE_KEY_CANDIDATE_NAME) || '').trim();
    } catch {
      return '';
    }
  }

  /**
   * Updates candidate name in localStorage and dispatches change event.
   */
  public setCandidateName(name: string): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const clean = name.trim();
      localStorage.setItem(STORAGE_KEY_CANDIDATE_NAME, clean);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(EVENT_CANDIDATE_NAME_UPDATED, { detail: clean }));
      }
    } catch (err) {
      console.warn('Failed to save candidate name:', err);
    }
  }

  /**
   * Returns true if candidate name has already been registered.
   */
  public hasCandidateName(): boolean {
    return Boolean(this.getCandidateName());
  }

  /**
   * Returns a friendly display name (Candidate Name or "Thí sinh ẩn danh #ID").
   */
  public getEffectiveCandidateName(): string {
    const raw = this.getCandidateName();
    if (raw) return raw;
    return `Thí sinh ẩn danh (${this.getDeviceId()})`;
  }

  /**
   * Gets the active Google Sheet Webhook URL.
   */
  public getSheetWebhookUrl(): string {
    if (typeof localStorage === 'undefined') return DEFAULT_SHEET_WEBHOOK_URL;
    try {
      const stored = localStorage.getItem(STORAGE_KEY_WEBHOOK);
      if (stored !== null) return stored.trim();
    } catch {}
    return DEFAULT_SHEET_WEBHOOK_URL;
  }

  public setSheetWebhookUrl(url: string): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY_WEBHOOK, url.trim());
    } catch {}
  }

  /**
   * Detects Device Type, OS, and Browser.
   */
  public getDeviceInfo(): {
    deviceType: string;
    os: string;
    browser: string;
    screen: string;
  } {
    if (typeof window === 'undefined') {
      return { deviceType: 'Unknown', os: 'Unknown', browser: 'Unknown', screen: 'Unknown' };
    }

    const ua = navigator.userAgent;
    let deviceType = 'Desktop';
    if (/iPad|Tablet/i.test(ua)) {
      deviceType = 'Tablet';
    } else if (/Mobi|Android|iPhone/i.test(ua)) {
      deviceType = 'Mobile';
    }

    let os = 'Unknown OS';
    if (/Windows NT/i.test(ua)) os = 'Windows';
    else if (/Macintosh|Mac OS/i.test(ua)) os = 'macOS';
    else if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS';
    else if (/Android/i.test(ua)) os = 'Android';
    else if (/Linux/i.test(ua)) os = 'Linux';

    let browser = 'Unknown Browser';
    if (/Edg\//i.test(ua)) browser = 'Edge';
    else if (/Chrome\//i.test(ua)) browser = 'Chrome';
    else if (/Safari\//i.test(ua) && !/Chrome/i.test(ua)) browser = 'Safari';
    else if (/Firefox\//i.test(ua)) browser = 'Firefox';
    else if (/Opera|OPR\//i.test(ua)) browser = 'Opera';

    const screen = typeof window !== 'undefined' ? `${window.screen.width}x${window.screen.height}` : 'N/A';

    return { deviceType, os, browser, screen };
  }

  /**
   * Pre-fetches IP and location in the background and caches it.
   */
  public async prefetchIp(): Promise<string> {
    if (this.cachedIp && this.cachedIp !== 'Không xác định') return this.cachedIp;

    try {
      const stored = localStorage.getItem(STORAGE_KEY_CACHED_IP);
      const storedLoc = localStorage.getItem(STORAGE_KEY_CACHED_LOC);
      if (stored) {
        this.cachedIp = stored;
        this.cachedLocation = storedLoc || 'Việt Nam';
        return stored;
      }
    } catch {}

    // 1. Try ipify (Fastest, zero rate limit, full CORS, never blocked)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch('https://api64.ipify.org?format=json', { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        if (data.ip) {
          this.cachedIp = data.ip;
          try {
            localStorage.setItem(STORAGE_KEY_CACHED_IP, data.ip);
          } catch {}
        }
      }
    } catch {}

    // 2. Try ipwho.is for City / Country location enrichment
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch('https://ipwho.is/', { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        if (data.ip) {
          this.cachedIp = data.ip;
          const loc = [data.city, data.country].filter(Boolean).join(', ') || 'Việt Nam';
          this.cachedLocation = loc;
          try {
            localStorage.setItem(STORAGE_KEY_CACHED_IP, data.ip);
            localStorage.setItem(STORAGE_KEY_CACHED_LOC, loc);
          } catch {}
        }
      }
    } catch {}

    return this.cachedIp || 'Không xác định';
  }

  /**
   * Silently fetches public IP and approximate geolocation.
   */
  public async fetchNetworkInfo(): Promise<{ ip: string; location: string; isp: string }> {
    const ip = await this.prefetchIp();
    let location = this.cachedLocation || 'Việt Nam';
    try {
      const storedLoc = localStorage.getItem(STORAGE_KEY_CACHED_LOC);
      if (storedLoc) location = storedLoc;
    } catch {}

    return {
      ip: ip || 'Không xác định',
      location: location || 'Việt Nam',
      isp: 'Nhà mạng VN',
    };
  }

  /**
   * Silently compiles and sends the exam completion payload in the background.
   */
  public async sendExamResult(
    result: ExamResult,
    config: ExamSetupConfig
  ): Promise<boolean> {
    try {
      const webhookUrl = this.getSheetWebhookUrl();
      if (!webhookUrl) {
        console.debug('Google Sheet webhook URL is not configured yet.');
        return false;
      }

      if (typeof fetch === 'undefined') {
        return false;
      }

      // 1. Gather network & device telemetry
      const network = await this.fetchNetworkInfo();
      const device = this.getDeviceInfo();

      // 2. Identify wrong & skipped questions
      const wrongList = result.reviewList
        .filter((r) => !r.isCorrect && r.userAnswer != null)
        .map((r) => r.question.id);
      const skippedList = result.reviewList
        .filter((r) => r.userAnswer == null)
        .map((r) => r.question.id);

      const topicSummary =
        config.selectedTopicIds && config.selectedTopicIds.length > 0
          ? config.selectedTopicIds.join(', ')
          : 'Tất cả';

      const payload: TelemetryPayload = {
        timestamp: new Date().toLocaleString('vi-VN'),
        candidateName: this.getEffectiveCandidateName(),
        deviceId: this.getDeviceId(),
        score10: result.score10,
        percentage: result.percentage,
        correctCount: result.correctCount,
        wrongCount: result.wrongCount,
        skippedCount: result.skippedCount,
        totalQuestions: result.total,
        isPassed: result.isPassed ? 'ĐẠT' : 'CHƯA ĐẠT',
        timeSpent: result.timeSpentFormatted,
        topicsSummary: topicSummary,
        wrongQuestions: wrongList.join(', ') || 'Không có',
        skippedQuestions: skippedList.join(', ') || 'Không có',
        ip: network.ip,
        location: network.location,
        isp: network.isp,
        device: device.deviceType,
        os: device.os,
        browser: device.browser,
        screen: device.screen,
        pageUrl: typeof window !== 'undefined' ? window.location.href : '',
      };

      // 3. Silent non-blocking HTTP POST with keepalive
      await fetch(webhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        keepalive: true,
      });

      return true;
    } catch (err) {
      console.debug('Silent telemetry dispatch failed:', err);
      return false;
    }
  }

  /**
   * Silently tracks practice mode session with in-depth learning metrics.
   */
  public async sendPracticeSummary(params: {
    answeredCount: number;
    correctCount: number;
    wrongCount: number;
    firstTryCorrectCount?: number;
    retryCorrectCount?: number;
    revealedSolutionsCount?: number;
    totalBankCompleted?: number;
    totalBankQuestions?: number;
    timeSpentSeconds: number;
    topicsSummary?: string;
    wrongQuestionIds?: string[];
  }): Promise<boolean> {
    try {
      if (params.answeredCount <= 0) return false;

      const webhookUrl = this.getSheetWebhookUrl();
      if (!webhookUrl || typeof fetch === 'undefined') return false;

      const network = await this.fetchNetworkInfo();
      const device = this.getDeviceInfo();

      const mins = Math.floor(params.timeSpentSeconds / 60);
      const secs = params.timeSpentSeconds % 60;
      const formattedTime = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
      const avgPace = Math.round(params.timeSpentSeconds / Math.max(1, params.answeredCount));

      const score10 = Number(((params.correctCount / params.answeredCount) * 10).toFixed(1));
      const percentage = Math.round((params.correctCount / params.answeredCount) * 100);

      // Cumulative bank progress text for the 'Kết quả' column
      let cumulativeText = 'LUYỆN TẬP';
      if (params.totalBankCompleted != null && params.totalBankQuestions) {
        const bankPct = ((params.totalBankCompleted / params.totalBankQuestions) * 100).toFixed(1);
        cumulativeText = `LUYỆN TẬP (Lũy kế: ${params.totalBankCompleted}/${params.totalBankQuestions} câu - ${bankPct}%)`;
      }

      // Detailed learning behaviors
      const firstTry = params.firstTryCorrectCount || 0;
      const retryOk = params.retryCorrectCount || 0;
      const revealed = params.revealedSolutionsCount || 0;
      const behaviorDetails = `Đúng lần đầu: ${firstTry} | Sửa đúng: ${retryOk} | Xem giải: ${revealed}`;

      const payload = {
        timestamp: new Date().toLocaleString('vi-VN'),
        candidateName: this.getEffectiveCandidateName(),
        deviceId: this.getDeviceId(),
        score10,
        percentage,
        correctCount: params.correctCount,
        wrongCount: params.wrongCount,
        skippedCount: 0,
        totalQuestions: params.answeredCount,
        isPassed: cumulativeText,
        timeSpent: `${formattedTime} (~${avgPace}s/câu)`,
        topicsSummary: params.topicsSummary || 'Tự do ôn luyện',
        wrongQuestions:
          params.wrongQuestionIds && params.wrongQuestionIds.length > 0
            ? params.wrongQuestionIds.join(', ')
            : 'Không có',
        skippedQuestions: behaviorDetails,
        ip: network.ip,
        location: network.location,
        isp: network.isp,
        device: device.deviceType,
        os: device.os,
        browser: device.browser,
        screen: device.screen,
        pageUrl: typeof window !== 'undefined' ? window.location.href : '',
      };

      await fetch(webhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        keepalive: true,
      });

      return true;
    } catch (err) {
      console.debug('Silent practice telemetry dispatch failed:', err);
      return false;
    }
  }
}

export const examTelemetryService = new ExamTelemetryService();
