export type LessonProgress = {
  completed: boolean
  checksCorrect: number
  checksTotal: number
}

export type RangeProgress = {
  correct: number
  total: number
}

export type QuizEvent = {
  kind: string
  correct: boolean
  at: number
}

export type PlayEvent = {
  handId: string
  grade: 'good' | 'ok' | 'leak'
  leak?: string
  at: number
}

export type ProgressState = {
  lessons: Record<string, LessonProgress>
  ranges: Record<string, RangeProgress>
  quizzes: QuizEvent[]
  play: PlayEvent[]
}

const KEY = 'poker-academy-progress-v1'

const empty = (): ProgressState => ({
  lessons: {},
  ranges: {},
  quizzes: [],
  play: [],
})

export function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return empty()
    const parsed = JSON.parse(raw) as ProgressState
    return {
      lessons: parsed.lessons ?? {},
      ranges: parsed.ranges ?? {},
      quizzes: parsed.quizzes ?? [],
      play: parsed.play ?? [],
    }
  } catch {
    return empty()
  }
}

export function saveProgress(state: ProgressState): void {
  localStorage.setItem(KEY, JSON.stringify(state))
}

export function recordLesson(id: string, checksCorrect: number, checksTotal: number): ProgressState {
  const state = loadProgress()
  const prev = state.lessons[id]
  state.lessons[id] = {
    completed: true,
    checksCorrect: Math.max(prev?.checksCorrect ?? 0, checksCorrect),
    checksTotal,
  }
  saveProgress(state)
  return state
}

export function recordRangeDrill(chartId: string, correct: boolean): ProgressState {
  const state = loadProgress()
  const prev = state.ranges[chartId] ?? { correct: 0, total: 0 }
  state.ranges[chartId] = {
    correct: prev.correct + (correct ? 1 : 0),
    total: prev.total + 1,
  }
  saveProgress(state)
  return state
}

export function recordRangeBuild(chartId: string, correct: number, total: number): ProgressState {
  const state = loadProgress()
  const prev = state.ranges[`${chartId}:build`] ?? { correct: 0, total: 0 }
  state.ranges[`${chartId}:build`] = {
    correct: prev.correct + correct,
    total: prev.total + total,
  }
  saveProgress(state)
  return state
}

export function recordPlay(handId: string, grade: PlayEvent['grade'], leak?: string): ProgressState {
  const state = loadProgress()
  state.play = [...(state.play ?? []), { handId, grade, leak, at: Date.now() }].slice(-300)
  saveProgress(state)
  return state
}

export function playStats(state: ProgressState): { hands: number; leaks: number; goods: number } {
  const events = state.play ?? []
  const hands = new Set(events.map((e) => e.handId)).size
  return {
    hands,
    leaks: events.filter((e) => e.grade === 'leak').length,
    goods: events.filter((e) => e.grade === 'good').length,
  }
}

export function recordQuiz(kind: string, correct: boolean): ProgressState {
  const state = loadProgress()
  state.quizzes = [...state.quizzes, { kind, correct, at: Date.now() }].slice(-200)
  saveProgress(state)
  return state
}

export function accuracy(correct: number, total: number): number {
  if (total <= 0) return 0
  return correct / total
}

export function quizStats(state: ProgressState): {
  correct: number
  total: number
  byKind: Record<string, RangeProgress>
} {
  const byKind: Record<string, RangeProgress> = {}
  let correct = 0
  for (const event of state.quizzes) {
    if (event.correct) correct += 1
    const bucket = byKind[event.kind] ?? { correct: 0, total: 0 }
    bucket.total += 1
    if (event.correct) bucket.correct += 1
    byKind[event.kind] = bucket
  }
  return { correct, total: state.quizzes.length, byKind }
}
