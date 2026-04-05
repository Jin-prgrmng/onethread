import { useReducer, useEffect, useState, useCallback } from 'react';
import { reducer, initialState, loadState, saveState } from './store';
import FocusView from './components/FocusView';
import CaptureModal from './components/CaptureModal';
import TaskQueue from './components/TaskQueue';
import PendingBuffer from './components/PendingBuffer';
import WorkLog from './components/WorkLog';
import SettingsPanel from './components/SettingsPanel';

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [captureOpen, setCaptureOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // 初回ロード
  useEffect(() => {
    const saved = loadState();
    dispatch({ type: 'LOAD_STATE', state: saved });
  }, []);

  // 永続化
  useEffect(() => {
    saveState(state);
  }, [state]);

  // ショートカットキー
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const tag = (e.target as HTMLElement).tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    if (e.key === 'm' || e.key === 'M') {
      setCaptureOpen(true);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="app">
      <header className="header">
        <span className="app-name">OneThread</span>
        <div className="header-actions">
          <button
            className="btn btn-ghost btn-small"
            onClick={() => setCaptureOpen(true)}
            aria-label="メモを追加"
          >
            メモ +
          </button>
          <button
            className="btn btn-ghost btn-small"
            onClick={() => setSettingsOpen(true)}
            aria-label="設定"
          >
            ≡
          </button>
        </div>
      </header>

      <main className="main">
        <FocusView
          task={state.currentTask}
          onComplete={() => dispatch({ type: 'COMPLETE_CURRENT' })}
          onSkip={() => dispatch({ type: 'SKIP_CURRENT' })}
          onPend={() => dispatch({ type: 'PEND_CURRENT' })}
          onAddTask={(text) => dispatch({ type: 'ADD_TASK', text })}
          timerDuration={state.timerDuration}
        />
      </main>

      <div className="sections">
        <TaskQueue
          queue={state.queue}
          onReorder={(activeId, overId) => dispatch({ type: 'REORDER_QUEUE', activeId, overId })}
          onSetAsCurrent={(id) => dispatch({ type: 'SET_AS_CURRENT', id, from: 'queue' })}
          onAddTask={(text) => dispatch({ type: 'ADD_TASK', text })}
        />
        <PendingBuffer
          pending={state.pending}
          onPromote={(id) => dispatch({ type: 'PROMOTE_TO_QUEUE', id })}
          onSetAsCurrent={(id) => dispatch({ type: 'SET_AS_CURRENT', id, from: 'pending' })}
          onDelete={(id) => dispatch({ type: 'DELETE_PENDING', id })}
        />
        <WorkLog log={state.log} />
      </div>

      <CaptureModal
        open={captureOpen}
        onClose={() => setCaptureOpen(false)}
        onCapture={(text) => dispatch({ type: 'ADD_CAPTURE', text })}
      />
      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        timerDuration={state.timerDuration}
        onSetTimerDuration={(minutes) => dispatch({ type: 'SET_TIMER_DURATION', minutes })}
      />
    </div>
  );
}
