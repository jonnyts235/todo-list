import React from "react";
import TodoItem from "./TodoItem";

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      todos: [],
      todo: ""
    };
  }

  componentDidMount() {
    fetch("https://todo-list-1ab0a.firebaseio.com/todos.json")
      .then(response => response.json())
      .then(data => {
        const loadedTodos = [];
        for (const id in data) {
          loadedTodos.push({ id, ...data[id] });
        }
        this.setState({ todos: loadedTodos });
      });
  }

  renderTodos = () => {
    return this.state.todos.map(todo => {
      return (
        <TodoItem
          key={todo.id}
          title={todo.title}
          done={todo.done}
          id={todo.id}
          delete={this.deletedTodo}
        />
      );
    });
  };

  handleChange = event => {
    this.setState({ todo: event.target.value });
  };

  addTodo = event => {
    event.preventDefault();
    fetch("https://todo-list-1ab0a.firebaseio.com/todos.json", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        title: this.state.todo,
        done: false
      })
    })
      .then(response => response.json())
      .then(data =>
        this.setState({
          todos: [
            ...this.state.todos,
            { id: data.name, title: this.state.todo, done: false }
          ],
          todo: ""
        })
      );
  };

  deletedTodo = id => {
    fetch(`https://todo-list-1ab0a.firebaseio.com/todos/${id}.json`, {
      method: "DELETE"
    }).then(
      this.setState({
        todos: this.state.todos.filter(todo => todo.id !== id)
      })
    );
  };

  render() {
    return (
      <div className="App">
        <h1>ToDo List</h1>
        <form onSubmit={this.addTodo}>
          <input
            type="text"
            placeholder="Add ToDo"
            value={this.state.todo}
            onChange={this.handleChange}
          />
          <button type="submit">Add</button>
        </form>
        {this.renderTodos()}
      </div>
    );
  }
}

export default App;
