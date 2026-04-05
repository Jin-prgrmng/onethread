import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '../types';
import CollapsibleSection from './CollapsibleSection';

type Props = {
  queue: Task[];
  onReorder: (activeId: string, overId: string) => void;
  onSetAsCurrent: (id: string) => void;
  onAddTask: (text: string) => void;
};

function SortableItem({
  task,
  onSetAsCurrent,
}: {
  task: Task;
  onSetAsCurrent: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <li ref={setNodeRef} style={style} className="queue-item">
      <span className="drag-handle" {...attributes} {...listeners}>
        ⠿
      </span>
      <span className="queue-item-text">{task.text}</span>
      <button
        className="btn btn-ghost btn-small"
        onClick={() => onSetAsCurrent(task.id)}
      >
        今すぐ
      </button>
    </li>
  );
}

export default function TaskQueue({ queue, onReorder, onSetAsCurrent, onAddTask }: Props) {
  const [inputText, setInputText] = useState('');

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      onReorder(String(active.id), String(over.id));
    }
  };

  const handleAdd = () => {
    if (!inputText.trim()) return;
    onAddTask(inputText.trim());
    setInputText('');
  };

  return (
    <CollapsibleSection title="次のタスク" count={queue.length}>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={queue.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          <ul className="queue-list">
            {queue.length === 0 && (
              <li className="queue-empty">キューは空です</li>
            )}
            {queue.map((task) => (
              <SortableItem key={task.id} task={task} onSetAsCurrent={onSetAsCurrent} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
      <div className="queue-add-row">
        <input
          className="queue-input"
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="タスクを追加…"
        />
        <button className="btn btn-ghost btn-small" onClick={handleAdd} disabled={!inputText.trim()}>
          追加
        </button>
      </div>
    </CollapsibleSection>
  );
}
