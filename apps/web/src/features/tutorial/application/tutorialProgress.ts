const tutorialCompletionKey = 'souls.tutorial.v1.completed';

export function hasCompletedTutorial(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    return window.localStorage.getItem(tutorialCompletionKey) === 'true';
  } catch {
    return false;
  }
}

export function markTutorialCompleted(): void {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(tutorialCompletionKey, 'true');
    } catch {
      // Local progress is optional and must not block the tutorial.
    }
  }
}
