export type Priority = 'low' | 'medium' | 'high';
export type Status = 'pending' | 'in_progress' | 'completed';
export type Category = 'Work' | 'Personal' | 'Health' | 'Learning' | 'Other';

export interface Task {
  id: string;
  title: string;
  description: string;
  category: Category;
  priority: Priority;
  status: Status;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  isLoggedIn: boolean;
}

export interface FilterOptions {
  category: string;
  priority: string;
  searchQuery: string;
  sortBy: string;
}