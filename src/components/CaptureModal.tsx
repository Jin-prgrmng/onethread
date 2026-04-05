import { useState, useEffect, useRef } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  onCapture: (text: string) => void;
};

export default function CaptureModal({ open, onClose, onCapture }: Props) {
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setText('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const handleSubmit = () => {
    if (!text.trim()) return;
    onCapture(text.trim());
    onClose();
  };

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <p className="modal-label">今は考えなくていい、ただ記録する</p>
        <input
          ref={inputRef}
          className="modal-input"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.nativeEvent.isComposing && handleSubmit()}
          placeholder="浮かんだことを入力…"
        />
        <div className="modal-actions">
          <button className="btn btn-accent" onClick={handleSubmit} disabled={!text.trim()}>
            記録する
          </button>
          <button className="btn btn-ghost" onClick={onClose}>
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
}
