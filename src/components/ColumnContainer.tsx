import { SortableContext } from "@dnd-kit/sortable";
import type { Column, Id, Task } from "../types";
import { useMemo } from "react";
import PlusIcon from "../icons/PlusIcon";
import TaskCard from "./TaskCard";
import { useDroppable } from "@dnd-kit/core";

interface Props {
  column: Column;
  createTask: (columnId: Id) => void;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void
  tasks: Task[];
}

export default function ColumnContainer(props: Props) {
  const {column, createTask, tasks, deleteTask, updateTask} = props;
  const taskIds = useMemo(() => tasks.map(task => task.id), [tasks]);

  // Making Column Droppable
  const { setNodeRef: setDroppableRef } = useDroppable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  return (
    <div className="bg-column-background-color w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col"
      ref={setDroppableRef}
    >
      {/* Column title */}
      <div className="bg-main-background-color text-md h-[60px] rounded-md rounded-b-none p-3 font-bold border-column-background-color border-4 flex items-center justify-between">
        {column.title}
      </div>
      {/* Column Task Container */}
      <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
        <SortableContext items={taskIds}>
          {tasks.map((task) => <TaskCard key={task.id} task={task} deleteTask={deleteTask} updateTask={updateTask} />)}
        </SortableContext>        
      </div>
      {/* Column footer */}
      <button onClick={() => createTask(column.id)} className="flex gap-2 items-center border-main-column-color border-2 rounded-md p-4 border-x-main-column-color hover:bg-main-background-color hover:text-rose-500 active:bg-black"><PlusIcon /> Add task</button>
    </div>
  )
}