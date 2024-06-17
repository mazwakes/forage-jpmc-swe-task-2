import React, { Component } from 'react';
import DataStreamer, { ServerRespond } from './DataStreamer';
import Graph from './Graph';
import './App.css';

/**
 * State declaration for <App />
 */
interface IState {
  data: ServerRespond[],
  showGraph: boolean, //changing the static table into a live graph
}

/**
 * The parent element of the react app.
 * It renders title, button and Graph react element.
 */
class App extends Component<{}, IState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      // data saves the server responds.
      // We use this state to parse data down to the child element (Graph) as element property
      data: [],
      showGraph: false, //setting the initial state of graph as false (shows when user clicks 'start streaming data')
    };
  }

  /**
   * Render Graph react component with state.data parse as property data
   */
  renderGraph() {
    if (this.state.showGraph){ //ensures the graph doesn't render until a user clicks the 'start streaming' button
          return (<Graph data={this.state.data}/>)
    }
  }

  /**
   * Get new data from server and update the state with the new data
   */
  getDataFromServer() { //gets data from the server continuously
    let x = 0; //counter to limit the number of data fetches
    const interval = setInterval(() => { //sets the number of time before fetching the data again
      DataStreamer.getData((serverResponds: ServerRespond[]) => { //gets data from server
        // Update the state by creating a new array of data that consists of
        // Previous data in the state and the new data from server
        this.setState({ //changes state so that the graph is shown
          data: serverResponds,
          showGraph: true,
        });
      });
      x++; //increases the counter as data has been fetched
      if (x > 1000) { //1000 fetches is the limit so checks if the limit has been reached
        clearInterval(interval);
      }
    }, 100); //data fetched
  }

  /**
   * Render the App react component
   */
  render() {
    return (
      <div className="App">
        <header className="App-header">
          Bank & Merge Co Task 2
        </header>
        <div className="App-content">
          <button className="btn btn-primary Stream-button"
            // when button is click, our react app tries to request
            // new data from the server.
            // As part of your task, update the getDataFromServer() function
            // to keep requesting the data every 100ms until the app is closed
            // or the server does not return anymore data.
            onClick={() => {this.getDataFromServer()}}>
            Start Streaming Data
          </button>
          <div className="Graph">
            {this.renderGraph()}
          </div>
        </div>
      </div>
    )
  }
}

export default App;
