import app from "ags/gtk4/app"
import { Astal, Gdk, Gtk } from "ags/gtk4"
import { execAsync } from "ags/process"
import { createPoll } from "ags/time"

import Workspaces from "../elements/Workspaces"
import State from "../elements/State"
import { onCleanup } from "ags"

// labels for hyprland workspaces. i just use 5
const buttons = [
  {
    label: "home.",
    symbol: "graveyard-symbolic",
  },
  {
    label: "chat.",
    symbol: "chat-symbolic",
  },
  {
    label: "code.",
    symbol: "bash-symbolic",
  },
  {
    label: "misc.",
    symbol: "globe-symbolic",
  },
  {
    label: "play.",
    symbol: "input-gaming-symbolic",
  },
]

export default function Bar(gdkmonitor: Gdk.Monitor) {
  const time = createPoll("", 1000, ["date", "+%A,\ %B\ %e\ -\ %r"])
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor
  let win: Astal.Window

  onCleanup(() => {
    // Root components (windows) are not automatically destroyed.
    // When the monitor is disconnected from the system, this callback
    // is run from the parent <For> which allows us to destroy the window
    win.destroy()
  })

  return (
    <Astal.Window
      $={(self) => (win = self)}
      visible
      name="bar"
      class="Bar"
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={TOP | LEFT | RIGHT}
      application={app}
    >
      <Gtk.CenterBox cssName="Gtk.CenterBox">
        <Gtk.Box $type="start" spacing={8}>
          <Workspaces buttons={buttons} />
        </Gtk.Box>
        <Gtk.Box $type="center">
          <Gtk.Button onClicked={() => execAsync(["walker", "-t", "red-dark"])}>
            <Gtk.Box>
              <Gtk.Label label={time} />
            </Gtk.Box>
          </Gtk.Button>
        </Gtk.Box>
        <Gtk.Box $type="end">
          <State />
        </Gtk.Box>
      </Gtk.CenterBox>
    </Astal.Window>
  )
}
