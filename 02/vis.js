/* global d3 Redux */

// A component that renders the count.
const countDisplay = d3.component('div', 'count-display')
  .render(function (selection, d) {
    selection.text(d.count);
  });

// A generic Button component.
const button = d3.component('button')
  .render(function (selection, d) {
    selection
      .text(d.text)
      .on('click', d.onClick);
  });

// The panel that contains the two buttons.
const buttonPanel = d3.component('div', 'button-panel')
  .render(function (selection, d) {
    selection.call(button, [
      {
        text: '-',
        onClick: d.actions.decrement,
      },
      {
        text: '+',
        onClick: d.actions.increment,
      }, 
    ]);
  });

// The top-level app component.
const app = d3.component('div')
  .render(function (selection, d) {
    selection
      .call(countDisplay, d)
      .call(buttonPanel, d);
  });

function main() {
  const store = Redux.createStore(reducer);
  const actions = actionsFromDispatch(store.dispatch);

  render();
  store.subscribe(render);

  function reducer(state, action) {
    const count = state || 0;
    switch (action.type) {
      case 'INCREMENT': return count + 1;
      case 'DECREMENT': return count - 1;
      default: return count;
    }
  }

  function actionsFromDispatch(dispatch) {
    return {
      increment() {
        dispatch({ type: 'INCREMENT' });
      },
      decrement() {
        dispatch({ type: 'DECREMENT' });
      },
    };
  }

  function render() {
    d3.select('body').call(app, {
      count: store.getState(),
      actions,
    });
  }
}

// call main() to run the app
main();
