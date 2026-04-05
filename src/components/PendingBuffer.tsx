import type { Task } from '../types';
import CollapsibleSection from './CollapsibleSection';

type Props = {
  pending: Task[];
  onPromote: (id: string) => void;
  onSetAsCurrent: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function PendingBuffer({ pending, onPromote, onSetAsCurrent, onDelete }: Props) {
  return (
    <CollapsibleSection title="保留バッファ" count={pending.length}>
      <ul className="pending-list">
        {pending.length === 0 && (
          <li className="queue-empty">保留はありません</li>
        )}
        {pending.map((task) => (
          <li key={task.id} className="pending-item">
            <span className="pending-item-text">{task.text}</span>
            <div className="pending-item-actions">
              <button className="btn btn-ghost btn-small" onClick={() => onSetAsCurrent(task.id)}>
                今すぐ
              </button>
              <button className="btn btn-ghost btn-small" onClick={() => onPromote(task.id)}>
                キューへ
              </button>
              <button
                className="btn btn-ghost btn-small btn-danger"
                onClick={() => onDelete(task.id)}
              >
                削除
              </button>
            </div>
          </li>
        ))}
      </ul>
    </CollapsibleSection>
  );
}
