/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Regex patterns for URL, email and phone number detection
 */
const URL_REGEX = /(https?:\/\/[^\s<>"{}|\\^`[\]]+)/gi;
const EMAIL_REGEX = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
const PHONE_REGEX = /((?:\+84|0)(?:\d[\s.-]?){9,10})/g;

export interface ParsedTextPart {
  type: "text" | "url" | "email" | "phone";
  value: string;
}

/**
 * Parse a string and detect URLs, emails and phone numbers
 * @param text - The input text to parse
 * @returns Array of parsed text parts with their types
 */
export const parseTextWithLinks = (text: string): ParsedTextPart[] => {
  if (!text) return [];

  const parts: ParsedTextPart[] = [];
  const combinedRegex = new RegExp(
    `(${URL_REGEX.source})|(${EMAIL_REGEX.source})|(${PHONE_REGEX.source})`,
    "gi"
  );

  let lastIndex = 0;
  let match;

  while ((match = combinedRegex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push({
        type: "text",
        value: text.slice(lastIndex, match.index),
      });
    }

    const matchedValue = match[0];

    // Determine if it's a URL, email or phone number
    if (URL_REGEX.test(matchedValue)) {
      URL_REGEX.lastIndex = 0; // Reset regex state
      parts.push({
        type: "url",
        value: matchedValue,
      });
    } else if (EMAIL_REGEX.test(matchedValue)) {
      EMAIL_REGEX.lastIndex = 0; // Reset regex state
      parts.push({
        type: "email",
        value: matchedValue,
      });
    } else {
      parts.push({
        type: "phone",
        value: matchedValue,
      });
    }

    lastIndex = match.index + matchedValue.length;
  }

  // Add remaining text after last match
  if (lastIndex < text.length) {
    parts.push({
      type: "text",
      value: text.slice(lastIndex),
    });
  }

  return parts;
};

/**
 * Format phone number for tel: link (remove spaces, dots, dashes)
 */
export const formatPhoneForLink = (phone: string): string => {
  return phone.replace(/[\s.-]/g, "");
};

export const parseDate = (field: any): Date => {
  if (!field) return new Date();
  if (field.toDate && typeof field.toDate === "function") {
    return field.toDate();
  }
  if (field instanceof Date) return field;
  return new Date(field);
};
