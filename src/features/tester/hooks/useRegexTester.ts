import { useMemo } from 'react';

export function useRegexTester(regex: string, flags: string, testText: string) {
  let matches: RegExpMatchArray[] = [];
  let error = null;

  try {
    const re = new RegExp(regex, flags);
    const allMatches = [...testText.matchAll(re)];
    matches = allMatches;
  } catch (e: any) {
    error = e.message;
  }

  return { matches, error };
}
