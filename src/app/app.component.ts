import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Todo } from './models/todo';
import { TodoHttpService } from './services/todo-http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  darkMode = false;

  todos: Todo[] = [];

  tasksLeft!: number;

  todoInput = '';

  selectedTodo: Todo | null = null;

  ACTIVE_TAB = 'All';

  tabs = [
    {
      id: '1',
      active: true,
      tab: 'All',
    },
    {
      id: '2',
      active: false,
      tab: 'Active',
    },
    {
      id: '3',
      active: false,
      tab: 'Completed',
    },
  ];

  constructor(private todoHttp: TodoHttpService) {}

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos() {
    this.todoHttp.getAllTodos().subscribe((data) => {
      console.log('GET Request', data);
      this.todos = data;
      this.tasksLeft = this.todos.filter((todo) => !todo.complete).length;
    });
  }

  toggleTheme() {
    this.darkMode = !this.darkMode;
  }

  submitForm(form: NgForm) {
    if (form.value !== '' && form.value !== null) {
      if (this.selectedTodo) {
        let updatedTask: Todo = {
          ...this.selectedTodo,
          task: form.value.todo,
        };

        this.todoHttp.updateTodo(updatedTask)?.subscribe((data) => {
          console.log('PUT Request', data);
          this.loadTodos();
          form.reset();
          this.selectedTodo = null;
        });
      } else {
        let createTodo: Todo = {
          task: form.value.todo,
          complete: false,
        };

        this.todoHttp.createTodo(createTodo).subscribe((data) => {
          console.log('POST Request', data);
          this.loadTodos();
          form.reset();
        });
      }
    }
  }

  displayTodos() {
    switch (this.ACTIVE_TAB) {
      case 'All':
        return this.todos;
      case 'Active':
        return this.todos.filter((todo) => !todo.complete);
      case 'Completed':
        return this.todos.filter((todo) => todo.complete);
      default:
        return this.todos;
    }
  }

  toggleComplete(todo: Todo) {
    let updateComplete: Todo = {
      ...todo,
      complete: (todo.complete = !todo.complete),
    };

    this.todoHttp.updateTodo(updateComplete)?.subscribe((data) => {
      console.log('PUT Request', data);
      this.loadTodos();
    });
  }

  deleteTodo(id: number) {
    this.todoHttp.deleteTodo(id)?.subscribe((data) => {
      console.log('DELETE Request', data);
      this.loadTodos();
    });
  }

  editTodo(todo: Todo) {
    this.selectedTodo = todo;
    this.todoInput = todo.task;
  }

  clearCompletedTodos() {
    let completedTodoIds = this.todos
      .filter((todo) => todo.complete)
      .map((todo) => todo.id) as number[];

    completedTodoIds.map((todoId) => this.deleteTodo(todoId));
  }

  toggleActiveTab(tabId: string) {
    this.tabs = this.tabs.map((tab) => {
      if (tab.id === tabId) {
        this.ACTIVE_TAB = tab.tab;
        tab.active = true;
        return tab;
      } else {
        tab.active = false;
        return tab;
      }
    });
  }

  // Drag & Drop Functionality

  draggedTodoIndex: number | undefined;
  droppedTodoIndex: number | undefined;

  droppedOn(dropEl: any) {
    console.log('Drag El', dropEl.srcElement.dataset.todoid);
    this.draggedTodoIndex = +dropEl.srcElement.dataset.todoid;
  }

  draggedElement(dragEl: any) {
    console.log('Dropped On', dragEl.srcElement.parentElement.dataset.todoid);
    this.droppedTodoIndex = +dragEl.srcElement.parentElement.dataset.todoid;
    console.log(this.draggedTodoIndex, this.droppedTodoIndex);
    if (
      (this.draggedTodoIndex || this.draggedTodoIndex === 0) &&
      (this.droppedTodoIndex || this.droppedTodoIndex === 0)
    ) {
      let tempTodo: Todo = this.todos[this.draggedTodoIndex];
      this.todos[this.draggedTodoIndex] = this.todos[this.droppedTodoIndex];
      this.todos[this.droppedTodoIndex] = tempTodo;

      console.log(this.todos);
    }
  }
}
