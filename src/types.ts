export type Task = {
  id: string;
  text: string;
  status: 'active' | 'queued' | 'pending' | 'done' | 'skipped';
  createdAt: string;
  completedAt?: string;
  note?: string;
};

export type AppState = {
  currentTask: Task | null;
  queue: Task[];
  pending: Task[];
  log: Task[];
  timerDuration: 5 | 10 | 15 | 25;
};

export type Action =
  | { type: 'COMPLETE_CURRENT' }
  | { type: 'SKIP_CURRENT' }
  | { type: 'PEND_CURRENT' }
  | { type: 'ADD_TASK'; text: string }
  | { type: 'ADD_CAPTURE'; text: string }
  | { type: 'PROMOTE_TO_QUEUE'; id: string }
  | { type: 'SET_AS_CURRENT'; id: string; from: 'queue' | 'pending' }
  | { type: 'DELETE_PENDING'; id: string }
  | { type: 'REORDER_QUEUE'; activeId: string; overId: string }
  | { type: 'SET_TIMER_DURATION'; minutes: 5 | 10 | 15 | 25 }
  | { type: 'LOAD_STATE'; state: AppState };
