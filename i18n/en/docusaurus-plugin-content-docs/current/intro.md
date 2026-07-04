---
sidebar_position: 1
---

# Welcome to Omni Widgets

Omni Widgets is a tool app that lets you **DIY your own iOS widgets**. You can put together a good-looking widget without writing any code; want something more complex — a widget that fetches data from the network or reacts to interaction? Omni ships with a full JavaScript runtime, so you can write scripts right inside the widget.

## What can Omni do

- **9 widget types**: home screen small / medium / large; lock screen circular / rectangular / inline; Control Center button / toggle; Live Activity (Dynamic Island).
- **Visual editor**: text, image, SF Symbol, button, shape, container… one tap to add.
- **JavaScript APIs**: network requests, weather, location, health, calendar, files — plus dynamic control over widget refresh and Live Activities.
- **Placeholder syntax**: bind the data you fetch in JS straight to your components with `${variable}`.
- **iCloud sync, URL Scheme, Shortcuts**: deep integration with the system.

## How to read the docs

If this is your **first time with Omni**, just go in this order:

1. [Concepts](./getting-started/concepts.md) — get "widget types / editor / where data comes from" in 5 minutes
2. [Build your first widget](./getting-started/first-widget.md) — follow along and build a "current weather" widget
3. [Placeholder syntax](./getting-started/placeholder.md) — the key step for getting JS data into components

If you're already familiar, jump straight to **Components** and **API** in the left sidebar.

## Run into trouble?

- Widget **not refreshing**? That's iOS system behavior — see [Widget refresh control](./api/control.md).
- JS **throwing errors**? Open the "console" in the editor to see your `console.log` output.
- Want to see **what's new**? Check the [Changelog](./changelog.md).
