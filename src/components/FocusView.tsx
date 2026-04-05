import { useState } from 'react';
import type { Task } from '../types';

type Props = {
  task: Task | null;
  onComplete: () => void;
  onSkip: () => void;
  onPend: () => void;
  onAddTask: (text: string) => void;
  timerDuration: number;
};

export default function FocusView({ task, onComplete, onSkip, onPend, onAddTask, timerDuration }: Props) {
  const [inputText, setInputText] = useState('');
  const [timerSec, setTimerSec] = useState<number | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerInterval, setTimerInterval] = useState<ReturnType<typeof setInterval> | null>(null);
  const [timerDone, setTimerDone] = useState(false);

  const handleSubmit = () => {
    if (!inputText.trim()) return;
    onAddTask(inputText.trim());
    setInputText('');
  };

  const startTimer = () => {
    if (timerRunning) return;
    const totalSec = timerDuration * 60;
    setTimerSec(totalSec);
    setTimerDone(false);
    setTimerRunning(true);

    const id = setInterval(() => {
      setTimerSec((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(id);
          setTimerRunning(false);
          setTimerDone(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setTimerInterval(id);
  };

  const resetTimer = () => {
    if (timerInterval) clearInterval(timerInterval);
    setTimerSec(null);
    setTimerRunning(false);
    setTimerDone(false);
    setTimerInterval(null);
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="focus-view">
      <div className="focus-task-area">
        {task ? (
          <>
            <p className="focus-task-text">{task.text}</p>
            <div className="focus-actions">
              <button className="btn btn-accent" onClick={onComplete}>完了</button>
              <button className="btn btn-ghost" onClick={onSkip}>スキップ</button>
              <button className="btn btn-ghost" onClick={onPend}>保留</button>
            </div>
          </>
        ) : (
          <div className="focus-empty">
            <p className="focus-placeholder">今やることを入力してください</p>
            <div className="focus-input-row">
              <input
                className="focus-input"
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.nativeEvent.isComposing && handleSubmit()}
                placeholder="例：この段落を書く"
                autoFocus
              />
              <button className="btn btn-accent" onClick={handleSubmit} disabled={!inputText.trim()}>
                開始
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="timer-area">
        {timerSec === null ? (
          <button className="btn btn-timer" onClick={startTimer}>
            ▶ {timerDuration}分タイマー開始
          </button>
        ) : (
          <div className="timer-running">
            <span className={`timer-display ${timerDone ? 'timer-done' : ''}`}>
              {timerDone ? '完了！' : formatTime(timerSec)}
            </span>
            <button className="btn btn-ghost btn-small" onClick={resetTimer}>
              リセット
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
