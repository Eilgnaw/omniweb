---
sidebar_position: 1
---

# Omni Widgets Documentation

Omni Widgets lets you build iOS widgets in a visual editor. Arrange text, images, and containers first. Add JavaScript only when you need dynamic data.

:::tip New to Omni?
Go straight to [Build your first widget](./getting-started/first-widget.md). In about 10 minutes, you'll have a medium widget that updates with the current weather.
:::

## What do you want to do?

| Goal | Start here |
| --- | --- |
| Build your first widget | [Build your first widget](./getting-started/first-widget.md) |
| Understand how Omni works | [Core concepts](./getting-started/concepts.md) |
| Show JavaScript data in components | [Placeholder syntax](./getting-started/placeholder.md) |
| Look up text, image, and container behavior | [Components](./components/text.md) |
| Use network, weather, health, or calendar data | [JavaScript APIs](./api/network.md) |

## What can Omni build?

- **Widgets for every common system surface**: small, medium, and large Home Screen widgets; circular, rectangular, and inline Lock Screen widgets; Control Center buttons and toggles; and Live Activities.
- **Visual layouts**: add text, images, SF Symbols, shapes, buttons, containers, grids, and canvases. Static widgets don't need code.
- **Data-powered widgets**: use JavaScript to call the network or read weather, location, health, calendar, and file data.
- **System integrations**: work with URL schemes, Shortcuts, iCloud files, and Live Activity push updates.

## Remember this workflow

1. Add components in the editor to define the layout.
2. Write results to `this.xxx` in JavaScript.
3. Display those results in component properties with `${xxx}`.

If you don't need dynamic data, step 1 is enough.

## Troubleshooting

- **Data isn't showing**: log the value in the console, then check the [placeholder](./getting-started/placeholder.md).
- **The widget didn't refresh on time**: iOS schedules refreshes. See [Widget control](./api/control.md).
- **Looking for recent changes**: read the [Changelog](./changelog.md).
