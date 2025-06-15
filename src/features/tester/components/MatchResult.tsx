import React from 'react';
import { Text } from 'react-native';

export const MatchResult = ({ text, matches }: { text: string; matches: RegExpMatchArray[] }) => {
  if (matches.length === 0) return <Text>{text}</Text>;

  const elements: React.ReactNode[] = [];
  let lastIndex = 0;

  matches.forEach((match, i) => {
    const start = match.index!;
    const end = start + match[0].length;

    // Texto antes del match
    if (lastIndex < start) {
      elements.push(<Text key={`pre-${i}`}>{text.slice(lastIndex, start)}</Text>);
    }

    // Texto que hace match
    elements.push(
      <Text key={`match-${i}`} style={{ backgroundColor: 'yellow', fontWeight: 'bold' }}>
        {text.slice(start, end)}
      </Text>
    );

    lastIndex = end;
  });

  // Texto restante después del último match
  if (lastIndex < text.length) {
    elements.push(<Text key="post">{text.slice(lastIndex)}</Text>);
  }

  return <Text>{elements}</Text>;
};
