export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  status: 'Planned'|'In Progress'|'Completed';
}

export interface Task {
  _id: string;
  project: string | Project;
  assignedTo: string;
  title: string;
  description?: string;
  status: 'To Do' | 'In Progress' | 'Done';
  dueDate?: string;
}

export interface ActivityLog {
  _id: string;
  user: User;
  action: string;
  metadata?: any;
  createdAt: string;
}