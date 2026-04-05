import type { Task } from '../types';
import CollapsibleSection from './CollapsibleSection';

type Props = {
  log: Task[];
};

function formatTime(isoString: string): string {
  const d = new Date(isoString);
  return d.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
}

function isToday(isoString: string): boolean {
  const d = new Date(isoString);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

export default function WorkLog({ log }: Props) {
  const todayLog = log.filter((t) => t.completedAt && isToday(t.completedAt));

  return (
    <CollapsibleSection title="今日の完了" count={todayLog.length}>
      <ul className="log-list">
        {todayLog.length === 0 && (
          <li className="queue-empty">まだ完了したタスクはありません</li>
        )}
        {todayLog.map((task) => (
          <li key={task.id} className="log-item">
            <span className="log-time">{task.completedAt ? formatTime(task.completedAt) : ''}</span>
            <span className="log-text">{task.text}</span>
          </li>
        ))}
      </ul>
    </CollapsibleSection>
  );
}
