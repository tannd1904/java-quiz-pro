import { ExamResult, ExamSetupConfig } from '../types/quiz';

const STORAGE_KEY_CANDIDATE_NAME = 'java_quiz_candidate_name';
const STORAGE_KEY_DEVICE_ID = 'java_quiz_device_id';
const STORAGE_KEY_WEBHOOK = 'java_quiz_sheet_webhook_url';

// Default Google Sheets Webhook URL (Can be overridden via localStorage or direct configuration)
export const DEFAULT_SHEET_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbyA3DfH_odzp_1N64ioXeRBZ6dt5Q0MLhdiZAm1FBd4ONn-2Ck-h97D7oeeE6isfKmp/exec';

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
   * Updates candidate name in localStorage.
   */
  public setCandidateName(name: string): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY_CANDIDATE_NAME, name.trim());
    } catch (err) {
      console.warn('Failed to save candidate name:', err);
    }
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
    } catch { }
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
   * Silently fetches public IP and approximate geolocation without requesting permissions.
   */
  public async fetchNetworkInfo(): Promise<{ ip: string; location: string; isp: string }> {
    try {
      // Fast fetch with 2.5s timeout abort signal
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const res = await fetch('https://ipapi.co/json/', {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const city = data.city || '';
        const country = data.country_name || '';
        const location = [city, country].filter(Boolean).join(', ') || 'Việt Nam';
        return {
          ip: data.ip || 'Không xác định',
          location,
          isp: data.org || data.asn || 'Không xác định',
        };
      }
    } catch {
      // Fallback to simple ipify
      try {
        const controller2 = new AbortController();
        const timeoutId2 = setTimeout(() => controller2.abort(), 1800);
        const res2 = await fetch('https://api.ipify.org?format=json', {
          signal: controller2.signal,
        });
        clearTimeout(timeoutId2);
        if (res2.ok) {
          const data2 = await res2.json();
          return {
            ip: data2.ip || 'Không xác định',
            location: 'Việt Nam',
            isp: 'Không xác định',
          };
        }
      } catch { }
    }

    return {
      ip: 'Không xác định',
      location: 'Không xác định',
      isp: 'Không xác định',
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
        // If not configured yet, log quietly in debug and return
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

      // 3. Silent non-blocking HTTP POST
      // mode: 'no-cors' prevents browser CORS blocks from Google Apps Script redirect
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
}

export const examTelemetryService = new ExamTelemetryService();
