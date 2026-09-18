export type Task = {
  id: number;
  title: string;
  completed: boolean;
};

export const tasks: Task[] = [
  {
    id: 1,
    title: "Learn Express",
    completed: true,
  },
  {
    id: 2,
    title: "Learn PostgreSQL",
    completed: false,
  },
];
