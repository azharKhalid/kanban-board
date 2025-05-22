import { lazy, Suspense, useEffect, useState } from "react";
import type { Id, Task } from "../types";
import ColumnContainer from "./ColumnContainer";
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, type DragOverEvent, type DragStartEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";
import { COLUMNS } from "../constants";
import { useLazyGetTodosQuery } from "../slices/todoSlice";
const Loader = lazy(() => import('./reusable/loader'));

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: {
      distance: 3 // drag will work after 3px
    }
  }));
  const [getTasks, result] = useLazyGetTodosQuery();
  const { data, error, isLoading } = result;
  
  useEffect(() => {
    getTasks();
  }, []);

  useEffect(() => {
    if (data?.todos?.length) {
      const transformedTasks = data?.todos?.map((item: any) => ({
        id: item.id,
        columnId: item.completed ? COLUMNS[2].id : COLUMNS[0].id,
        content: item.todo || "Untitled title",
        completed: item.completed
      }));
      setTasks(transformedTasks);
    }
  }, [data]);

  if (isLoading) return (
    <Suspense fallback={<div>Loading...</div>}>
      <Loader />
    </Suspense>  
  )

  if (error) return <p>Error fetching todos.</p>;

  function generateId() {
    /** Generate a random number between 1 and 1000 */
    return Math.floor(Math.random() * 10001);
  }

  function onDragStart(event: DragStartEvent) {
    if (event?.active?.data?.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
    }
  }

  function onDragOver(event: DragOverEvent) {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";

    if (!isActiveTask) return;

    // Dropping a task over another task
    if (isActiveTask && isOverTask) {
      setTasks(tasks => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);
        const updatedTasks = [...tasks];
        const activeTask = updatedTasks[activeIndex];
        updatedTasks[activeIndex] = { ...activeTask, columnId: tasks[overIndex].columnId };
        return arrayMove(updatedTasks, activeIndex, overIndex);
      })
    }

    const isOverAColumn = over?.data?.current?.type === "Column";
    // Dropping a task over another column
    if (isActiveTask && isOverAColumn) {
      setTasks(tasks => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const updatedTasks = [...tasks];
        updatedTasks[activeIndex] = { ...updatedTasks[activeIndex], columnId: overId };
        return arrayMove(updatedTasks, activeIndex, activeIndex);
      })
    }
  }

  function createTask(columnId: Id) {
    const newTask: Task = {
      id: generateId(),
      columnId,
      content: `Task ${tasks.length + 1}`
    }
    setTasks([...tasks, newTask]);
  }

  function deleteTask(id: Id) {
    const filteredTasks = tasks.filter(task => task.id !== id);
    setTasks(filteredTasks);
  }

  function updateTask(id: Id, content: string) {
    const newTasks = tasks.map((task) => {
      if (task.id !== id) return task;
      return { ...task, content }
    })
    setTasks(newTasks);
  }

  return (
    <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px]">
      <DndContext onDragStart={onDragStart} sensors={sensors} onDragOver={onDragOver}>
        <div className="m-auto flex gap-4">
          {COLUMNS.map((col) => (
            <ColumnContainer key={col.id} column={col} createTask={createTask} tasks={tasks.filter(task => task.columnId === col.id)} deleteTask={deleteTask} updateTask={updateTask} />
          ))}
        </div>
        {createPortal(
          <DragOverlay>
            <>
              {/* {activeTask && ( */}
                <TaskCard
                  task={activeTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                />
              {/* )} */}
            </>
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
}