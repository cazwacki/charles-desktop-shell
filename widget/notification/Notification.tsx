import { Gdk, Gtk } from "ags/gtk4";
import GLib from "gi://GLib?version=2.0";
import Pango from "gi://Pango";
import AstalNotifd from "gi://AstalNotifd";
import Gio from "gi://Gio?version=2.0";

const time = (time: number, format = "%H:%M") => {
  return GLib.DateTime.new_from_unix_local(time).format(format);
};

const isIcon = (icon: string) => {
  const iconTheme = Gtk.IconTheme.get_for_display(Gdk.Display.get_default());
  return iconTheme.has_icon(icon);
};

const fileExists = (path: string) => GLib.file_test(path, GLib.FileTest.EXISTS);

const urgency = (n: AstalNotifd.Notification) => {
  const { LOW, NORMAL, CRITICAL } = AstalNotifd.Urgency;

  switch (n.urgency) {
    case LOW:
      return "low";
    case CRITICAL:
      return "critical";
    case NORMAL:
    default:
      return "normal";
  }
};

export default function Notification({
  n,
  showActions = true,
}: {
  n: AstalNotifd.Notification;
  showActions?: boolean;
}) {
  return (
    <box
      name={n.id.toString()}
      cssClasses={["notification-container", urgency(n)]}
      $={() => GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 5, () => {
        n.dismiss();
        return GLib.SOURCE_REMOVE;
      })}
      halign={Gtk.Align.END}
      hexpand={false}
      vexpand={true}
    >
      <box orientation={Gtk.Orientation.VERTICAL}>
        <box vexpand hexpand cssClasses={["header"]}>
          <Gtk.Separator hexpand valign={Gtk.Align.BASELINE_CENTER} />
          <label cssClasses={["title"]} label={`${n.appName.toLowerCase() || "unknown"}. `} />
          <Gtk.Separator hexpand valign={Gtk.Align.BASELINE_CENTER} />
        </box>
        <box hexpand cssClasses={["content"]} spacing={8}>
          {n.image && fileExists(n.image) && (
            <box valign={Gtk.Align.START} cssClasses={["image"]}>
              <overlay heightRequest={60} widthRequest={60}>
                <Gtk.Picture $type="overlay" canShrink contentFit={Gtk.ContentFit.SCALE_DOWN} file={Gio.File.new_for_path(n.image)}  />
              </overlay>
            </box>
          )}
          {n.image && isIcon(n.image) && (
            <box cssClasses={["icon-image"]} valign={Gtk.Align.START}>
              <image
                iconName={n.image}
                iconSize={Gtk.IconSize.LARGE}
                halign={Gtk.Align.CENTER}
                valign={Gtk.Align.CENTER}
              />
            </box>
          )}
          <box hexpand orientation={Gtk.Orientation.VERTICAL}>
            <label
              ellipsize={Pango.EllipsizeMode.END}
              maxWidthChars={30}
              cssClasses={["summary"]}
              halign={Gtk.Align.START}
              xalign={0}
              label={n.summary}
            />
            {n.body && (
              <label
                maxWidthChars={30}
                lines={3}
                wrap
                ellipsize={Pango.EllipsizeMode.END}
                cssClasses={["body"]}
                halign={Gtk.Align.START}
                xalign={0}
                label={n.body.replace(/\s+/g, ' ')}
              />
            )}
          </box>
        </box>
        {showActions && (
          <box orientation={Gtk.Orientation.VERTICAL} cssClasses={["actions"]} spacing={6}>
            <button hexpand onClicked={() => n.dismiss()}>
              <label label="dismiss." />
            </button>
            {n.get_actions().map(({ label, id }) => (
              <button hexpand onClicked={() => n.invoke(id)}>
                <label label={`${label.toLowerCase()}.`} halign={Gtk.Align.CENTER} hexpand />
              </button>
            ))}
          </box>
        )}
      </box>

    </box>
  );
}