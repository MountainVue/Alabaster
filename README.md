# Alabaster

A web interface for Klipper 3D printers. It runs in any browser on your
network, connects to Moonraker, and is built to be read from across a workshop
and driven with one hand on a phone.

Alabaster is a static site. It runs no process on your printer, keeps no
database, and needs no account.

## Install

Run this on the machine running Klipper, as the user that owns it, not as
root:

```bash
bash -c "$(curl -fsSL https://raw.githubusercontent.com/MountainVue/Alabaster/main/scripts/install.sh)"
```

Then open `http://<your-printer>.local:8090`. `8090` is the default port, and
the installer lets you choose another.

The installer downloads the latest release and verifies its checksum. Before
it changes anything outside its own directory, it lists every change it would
make, so you decide all of them at once. Each one is optional:

| Step                      | What it adds                                                                                                                       |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Macro pack                | `alabaster.cfg`, with the pause, resume, cancel, and pause-at-layer macros. Controls that need it stay hidden without it.          |
| Include in `printer.cfg`  | Offered only when nothing else already defines the same macros. If something does, you see which macros and which file.            |
| nginx site                | Serves Alabaster and proxies Moonraker and up to four crowsnest cameras on one port, so the browser has a single address to reach. |
| Updates through Moonraker | Alabaster and its macro pack appear on the Machine page next to Klipper and Moonraker, and update from there.                      |

It needs `curl`, `unzip`, and `git` on the host. If the install changed
Klipper's or Moonraker's configuration, the installer can restart them for
you, and it refuses while a print is running or paused.

**Updating.** Run the same command again, or install the update from the
Machine page when Moonraker manages it. Your settings live in the browser, and
an `alabaster.cfg` you have edited is never overwritten.

**Uninstalling.** Run `bash ~/alabaster/scripts/uninstall.sh` and choose what
is removed.

**More than one printer.** Serve Alabaster from a NAS, an always-on box, or a
container, so the interface stays reachable when any one printer is off.

The [installation guide](https://mountainvue.github.io/Alabaster/guide/installation)
covers every flag, the separate-host setup, installing by hand, and remote
access through OctoEverywhere.

## What you get

Alabaster does what you expect from a Klipper interface: start and queue
prints, home and jog, set temperatures, run macros, calibrate, edit the
configuration, and update the host's software. It also adds the following.

- **No reload for a restart.** Klipper, Moonraker, and firmware restarts are
  handled in place. Stale values dim and return when fresh data arrives, and
  you keep your scroll position, your open file, and your half-typed command.
- **Time-to-temperature for each heater.** Alabaster learns each heater's
  climb curve from your own machine. It shows when the heater will reach its
  target, how fast it is climbing, and when it has stopped climbing.
- **Progress compared to the slicer's estimate.** A print that falls behind
  says so, at a threshold you set, and shows the time of day it will finish.
- **`printer.cfg` with linked includes.** Ctrl+click an `[include]` line to
  open that file, create a missing file from the line that names it, and let
  Alabaster update the include when you move a file.
- **A G-code viewer for modest hardware.** Five detail levels, down to plain
  lines, keep it smooth on a phone or the Pi's own browser. It follows a live
  print along the real path in the file, replays a slice at up to 20×, and
  cuts the model open layer by layer.
- **Maintenance counted from the printer's history.** Set intervals in print
  hours, metres of filament, or days. Alabaster measures them against
  Moonraker's lifetime totals and asks before a print starts into an overdue
  one.
- **A dashboard you build.** Fifteen modules across up to three columns, with
  separate layouts for desktop, tablet, and phone.
- **Several printers.** Switch between saved printers from the header, and
  watch all of them at once on the Farm page.
- **Accessibility enforced by tests.** Every control meets WCAG AA contrast on
  every surface, and chromatic color stays inside a color-blind-safe palette.
  The build fails when either breaks. Status is never carried by color alone,
  and five typefaces are included, one of them OpenDyslexic.

[What makes it different](https://mountainvue.github.io/Alabaster/guide/highlights)
covers each of these in full.

## Requirements

| You need               | Notes                                                                         |
| ---------------------- | ----------------------------------------------------------------------------- |
| Klipper with Moonraker | Any current release. The installer is tested on 64-bit Raspberry Pi OS.       |
| A modern browser       | Chrome, Edge, Firefox, or Safari, on desktop or mobile.                       |
| Hardware 3D rendering  | For the G-code viewer and the bed mesh map. Everything else works without it. |

## Status

Alabaster is in development ahead of a 1.0.0 release. Every page works and
carries daily printing on real printers, and details still change between
releases. The interface is available in English and Norwegian Bokmål.
[Project status](https://mountainvue.github.io/Alabaster/guide/status) lists
what is shipped and what is not.

## Documentation

The full guide is at
**[mountainvue.github.io/Alabaster](https://mountainvue.github.io/Alabaster)**:
every page of the interface, connecting to Moonraker, macros, theming,
accessibility, and keyboard shortcuts.

## Contributing

Alabaster takes issues, translations, theme packs, and code. Work happens on
`develop`, and `main` carries releases and the documentation site.

```bash
npm install
npm run dev
```

```bash
npm run check
```

`npm run check` is the gate before any pull request: formatting, linting,
type-checking, every test, and the production build.

The [development guide](https://mountainvue.github.io/Alabaster/guide/development)
covers Node.js versions (24.15+, or 22.22.2+ within the 22.x line), the Docker
Compose dev service, and the documentation site's own build.
[Contributing](https://mountainvue.github.io/Alabaster/contributing)
summarises the conventions the codebase follows: page layout, the button
system, dialogs, the dashboard module contract, the Moonraker transport,
theming, and deployment.

## License

[GNU GPLv3](LICENSE).

Every icon in [`AppIcon.vue`](src/components/AppIcon.vue) is hand-drawn or
redrawn from an MIT/Apache-2.0-licensed glyph, neither of which require
attribution. Two exceptions: the Spoolman card's icon (the `spool` token) is
selfh.st's ["spoolman-light"](https://icon-sets.iconify.design/selfhst/spoolman-light/)
icon, © [selfh.st](https://selfh.st/icons/), licensed
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/); and the
Temperatures card's five `thermometer*` fill-level icons are redrawn from
[Font Awesome 4](https://github.com/FortAwesome/Font-Awesome/tree/fa-4)
(© Dave Gandy), licensed
[SIL OFL 1.1](https://scripts.sil.org/cms/scripts/page.php?site_id=nrsi&id=OFL).

## Prior art

Alabaster's dashboard-module layout, its everyday-controls-first card
anatomy, and much of what it expects a Klipper front end to expose all trace
back to [Mainsail](https://github.com/mainsail-crew/mainsail) and
[Fluidd](https://github.com/fluidd-core/fluidd) — years of production use
against real printers settled most of what a Moonraker client needs to get
right, and Alabaster's own design docs were written against a survey of both.
What's deliberately not carried over is their implementation: Alabaster is a
from-scratch Vue 3 / Composition API codebase, not built on their Vue 2,
class-component, Vuex, or Vuetify architecture.
