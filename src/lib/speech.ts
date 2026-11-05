/** Text-to-speech via the browser's Web Speech API (en-US, slightly slowed, as in the design). */

function utter(text: string): SpeechSynthesisUtterance {
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US';
  u.rate = 0.9;
  return u;
}

export function speak(text: string): void {
  try {
    speechSynthesis.cancel();
    speechSynthesis.speak(utter(text));
  } catch { /* speech not supported */ }
}

/** Speak several lines back to back (used for "Nghe cả đoạn"). */
export function speakAll(lines: string[]): void {
  try {
    speechSynthesis.cancel();
    lines.forEach((l) => speechSynthesis.speak(utter(l)));
  } catch { /* speech not supported */ }
}
