import { Gtk } from "astal/gtk4";
import AstalHyprland from "gi://AstalHyprland";
import { bind } from "astal";
import { Variable } from "astal";
import { ButtonProps } from "astal/gtk4/widget";

type WsButtonProps = ButtonProps & {
  ws: AstalHyprland.Workspace;
  symbol: string;
  label: string;
};

const hyprland = AstalHyprland.get_default();

function WorkspaceButton({ ws, symbol, label, ...props }: WsButtonProps) {
  const classNames = Variable.derive(
    [bind(hyprland, "focusedWorkspace"), bind(hyprland, "clients")],
    (fws, _) => {
      const classes = ["workspace-button"];

      const active = fws.id == ws.id;
      active && classes.push("active");

      const occupied = hyprland.get_workspace(ws.id)?.get_clients().length > 0;
      occupied && classes.push("occupied");
      return classes;
    },
  );

  return (
    <button
      cssClasses={classNames()}
      onDestroy={() => classNames.drop()}
      valign={Gtk.Align.CENTER}
      halign={Gtk.Align.CENTER}
      onClicked={() => ws.focus()}
      {...props}
    >
      <box cssClasses={["workspace-button-box"]}>
        <image iconName={symbol} />
        <label label={label} />
      </box>
    </button>
  );
}

type WorkspacesPanelButtonProps = {
    buttons: Array<{
      symbol: string;
      label: string;
    }> 
}

export default function WorkspacesPanelButton({ buttons }: WorkspacesPanelButtonProps) {
  return (
    <box spacing={4}>
      {buttons.map((button, index) => (
        <WorkspaceButton ws={AstalHyprland.Workspace.dummy(index + 1, null)} label={button.label} symbol={button.symbol} />
      ))}
    </box>
  );
}