import { useEffect, useRef } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  timerDuration: 5 | 10 | 15 | 25;
  onSetTimerDuration: (d: 5 | 10 | 15 | 25) => void;
};

const DURATIONS: (5 | 10 | 15 | 25)[] = [5, 10, 15, 25];

export default function SettingsPanel({ open, onClose, timerDuration, onSetTimerDuration }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div ref={panelRef} className="modal-box settings-box" onClick={(e) => e.stopPropagation()}>
        <h2 className="settings-title">設定</h2>

        <div className="settings-row">
          <span className="settings-label">タイマー時間</span>
          <div className="settings-options">
            {DURATIONS.map((d) => (
              <button
                key={d}
                className={`btn btn-small ${timerDuration === d ? 'btn-accent' : 'btn-ghost'}`}
                onClick={() => onSetTimerDuration(d)}
              >
                {d}分
              </button>
            ))}
          </div>
        </div>

        <button className="btn btn-ghost" onClick={onClose} style={{ marginTop: '1.5rem' }}>
          閉じる
        </button>
      </div>
    </div>
  );
}
