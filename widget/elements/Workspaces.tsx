import { Gtk } from "ags/gtk4"
import AstalHyprland from "gi://AstalHyprland"
import { createBinding, createComputed, With } from "gnim"

function WorkspaceButton({ ws, symbol, label, ...props }: WsButtonProps) {
  const workspaceState = createComputed(() => {
    const hyprland = AstalHyprland.get_default()
    const focusedWorkspace = createBinding(hyprland, "focusedWorkspace")
    const clients = createBinding(ws, "clients")

    if (focusedWorkspace().id === ws.id) {
      return "active"
    } else if (clients().length > 0) {
      return "occupied"
    } else {
      return ""
    }
  })

  return (
    <Gtk.Box>
      <With value={workspaceState}>
        {(value) => (
          <Gtk.Button
            cssClasses={["workspace-button", value]}
            valign={Gtk.Align.CENTER}
            halign={Gtk.Align.CENTER}
            onClicked={() => ws.focus()}
            {...props}
          >
            <Gtk.Box cssClasses={["workspace-button-Gtk.Box"]}>
              <Gtk.Image iconName={symbol} />
              <Gtk.Label label={label} />
            </Gtk.Box>
          </Gtk.Button>
        )}
      </With>
    </Gtk.Box>
  )
}

type WorkspacesPanelButtonProps = {
  buttons: Array<{
    symbol: string
    label: string
  }>
}

export default function WorkspacesPanelButton({
  buttons,
}: WorkspacesPanelButtonProps) {
  return (
    <Gtk.Box spacing={4}>
      {buttons.map((button, index) => (
        <WorkspaceButton
          ws={AstalHyprland.Workspace.dummy(index + 1, null)}
          label={button.label}
          symbol={button.symbol}
        />
      ))}
    </Gtk.Box>
  )
}
