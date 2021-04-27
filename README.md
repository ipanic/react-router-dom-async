# react-router-dom-asynchronously
Addon for `react-router-dom`, which adds asynchrony to your routing
Main goal of this package to have an ability to prefetch any data before transition to the next state.
Loaded data will be passed as props

Current state will be shown until next route will be loaded.
This means, you don't need to show fallbacks while loading initial route component state.
Nested routing supported (AsyncSwitch component must be used on first render).
Next transition will not be applied until all nested routes will be loaded.

## Usage
See `/example` directory

## Limitations

//ToDo
