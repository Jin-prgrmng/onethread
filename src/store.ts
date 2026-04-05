import type { AppState, Action, Task } from './types';

const STORAGE_KEY = 'onethread_state';

export const initialState: AppState = {
  currentTask: null,
  queue: [],
  pending: [],
  log: [],
  timerDuration: 5,
};

function newTask(text: string, status: Task['status']): Task {
  return {
    id: crypto.randomUUID(),
    text: text.trim(),
    status,
    createdAt: new Date().toISOString(),
  };
}

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ADD_TASK': {
      const task = newTask(action.text, state.currentTask ? 'queued' : 'active');
      if (!state.currentTask) {
        return { ...state, currentTask: task };
      }
      return { ...state, queue: [...state.queue, task] };
    }

    case 'ADD_CAPTURE': {
      const task = newTask(action.text, 'pending');
      return { ...state, pending: [...state.pending, task] };
    }

    case 'COMPLETE_CURRENT': {
      if (!state.currentTask) return state;
      const done: Task = {
        ...state.currentTask,
        status: 'done',
        completedAt: new Date().toISOString(),
      };
      const [next, ...rest] = state.queue;
      return {
        ...state,
        currentTask: next ? { ...next, status: 'active' } : null,
        queue: rest,
        log: [done, ...state.log],
      };
    }

    case 'SKIP_CURRENT': {
      if (!state.currentTask) return state;
      const skipped: Task = { ...state.currentTask, status: 'queued' };
      const [next, ...rest] = state.queue;
      return {
        ...state,
        currentTask: next ? { ...next, status: 'active' } : null,
        queue: next ? [...rest, skipped] : [skipped],
      };
    }

    case 'PEND_CURRENT': {
      if (!state.currentTask) return state;
      const pended: Task = { ...state.currentTask, status: 'pending' };
      const [next, ...rest] = state.queue;
      return {
        ...state,
        currentTask: next ? { ...next, status: 'active' } : null,
        queue: rest,
        pending: [...state.pending, pended],
      };
    }

    case 'PROMOTE_TO_QUEUE': {
      const item = state.pending.find((t) => t.id === action.id);
      if (!item) return state;
      const remaining = state.pending.filter((t) => t.id !== action.id);
      const promoted: Task = { ...item, status: 'queued' };
      return { ...state, pending: remaining, queue: [...state.queue, promoted] };
    }

    case 'SET_AS_CURRENT': {
      if (action.from === 'queue') {
        const item = state.queue.find((t) => t.id === action.id);
        if (!item) return state;
        const remaining = state.queue.filter((t) => t.id !== action.id);
        const prev = state.currentTask
          ? [{ ...state.currentTask, status: 'queued' as const }, ...remaining]
          : remaining;
        return { ...state, currentTask: { ...item, status: 'active' }, queue: prev };
      } else {
        const item = state.pending.find((t) => t.id === action.id);
        if (!item) return state;
        const remaining = state.pending.filter((t) => t.id !== action.id);
        const prev = state.currentTask
          ? [...state.queue, { ...state.currentTask, status: 'queued' as const }]
          : state.queue;
        return { ...state, currentTask: { ...item, status: 'active' }, pending: remaining, queue: prev };
      }
    }

    case 'DELETE_PENDING': {
      return { ...state, pending: state.pending.filter((t) => t.id !== action.id) };
    }

    case 'REORDER_QUEUE': {
      const from = state.queue.findIndex((t) => t.id === action.activeId);
      const to = state.queue.findIndex((t) => t.id === action.overId);
      if (from === -1 || to === -1) return state;
      const next = [...state.queue];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return { ...state, queue: next };
    }

    case 'SET_TIMER_DURATION': {
      return { ...state, timerDuration: action.minutes };
    }

    case 'LOAD_STATE': {
      return action.state;
    }

    default:
      return state;
  }
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    return { ...initialState, ...JSON.parse(raw) };
  } catch {
    return initialState;
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage unavailable
  }
}
