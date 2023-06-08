export interface Todo {
  id?: number;
  task: string;
  complete: boolean;
}

export enum Tabs {
  ALL = 'All',
  ACTIVE = 'Active',
  COMPLETED = 'Completed'
}