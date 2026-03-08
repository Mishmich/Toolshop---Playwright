import axios from 'axios';

const TESTMAIL_API_KEY = process.env.TESTMAIL_API_KEY;
const TESTMAIL_NAMESPACE = process.env.TESTMAIL_NAMESPACE;
const API_ENDPOINT = 'https://api.testmail.app/api/json';
const DEFAULT_TIMEOUT = 300000; // 5 minutes

/**
 * Generate a unique tag for test email isolation
 */
export function generateTag(): string {
  return Math.random().toString(36).substring(2, 14);
}

/**
 * Get the test email address for a given tag
 */
export function getTestEmailAddress(tag: string): string {
  return `${TESTMAIL_NAMESPACE}.${tag}@inbox.testmail.app`;
}

/**
 * Wait for an email with live query (polls every minute with 307 redirects)
 * Handles timeouts gracefully - returns null instead of throwing
 */
export async function waitForEmail(tag: string, timeout = DEFAULT_TIMEOUT): Promise<any | null> {
  const startTimestamp = Date.now();
  const startTime = Date.now();

  try {
    while (Date.now() - startTime < timeout) {
      try {
        const response = await axios.get(API_ENDPOINT, {
          params: {
            apikey: TESTMAIL_API_KEY,
            namespace: TESTMAIL_NAMESPACE,
            tag: tag,
            timestamp_from: startTimestamp,
            livequery: 'true'
          },
          timeout: timeout - (Date.now() - startTime)
        });

        if (response.data.result === 'success' && response.data.emails && response.data.emails.length > 0) {
          console.log(`Email received for tag: ${tag}`);
          return response.data.emails[0];
        }
      } catch (error: any) {
        // 307 is expected for live queries (redirect to retry)
        if (error.response?.status === 307) {
          continue;
        }
        throw error;
      }
    }

    console.warn(`Timeout waiting for email with tag: ${tag} (${timeout}ms)`);
    return null;
  } catch (error) {
    console.error(`Failed to wait for email with tag ${tag}:`, error);
    return null;
  }
}

/**
 * Get all emails for a tag
 */
export async function getEmailsByTag(tag: string): Promise<any[]> {
  try {
    const response = await axios.get(API_ENDPOINT, {
      params: {
        apikey: TESTMAIL_API_KEY,
        namespace: TESTMAIL_NAMESPACE,
        tag: tag
      }
    });

    if (response.data.result === 'success') {
      return response.data.emails || [];
    }
    return [];
  } catch (error) {
    console.error(`Failed to get emails for tag ${tag}:`, error);
    return [];
  }
}

/**
 * Extract code from email using custom regex pattern
 * Default pattern: 6 digit code
 */
export async function extractCodeFromEmail(
  email: any,
  codePattern: RegExp = /\b\d{6}\b/
): Promise<string | null> {
  if (!email) {
    console.warn('Email is null or undefined');
    return null;
  }

  const text = email.html || email.text || '';

  if (!text) {
    console.warn('Email has no html or text content');
    return null;
  }

  const match = text.match(codePattern);

  if (!match) {
    console.warn(`Code not found in email using pattern: ${codePattern}`);
    return null;
  }

  console.log(`Code extracted: ${match[0]}`);
  return match[0];
}

/**
 * Convenience function: Wait for email and extract code
 */
export async function waitForEmailAndExtractCode(
  tag: string,
  codePattern: RegExp = /\b\d{6}\b/,
  timeout = DEFAULT_TIMEOUT
): Promise<string | null> {
  const email = await waitForEmail(tag, timeout);

  if (!email) {
    return null;
  }

  return extractCodeFromEmail(email, codePattern);
}

/**
 * Get email subject by tag (useful for verification)
 */
export async function getEmailSubject(tag: string): Promise<string | null> {
  const emails = await getEmailsByTag(tag);

  if (emails.length === 0) {
    return null;
  }

  return emails[0].subject || null;
}

/**
 * Check if email exists for tag
 */
export async function emailExists(tag: string): Promise<boolean> {
  const emails = await getEmailsByTag(tag);
  return emails.length > 0;
}
