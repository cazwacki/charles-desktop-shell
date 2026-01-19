import { Gdk, Gtk } from "ags/gtk4"
import GLib from "gi://GLib?version=2.0"
import Pango from "gi://Pango"
import AstalNotifd from "gi://AstalNotifd"
import Gio from "gi://Gio?version=2.0"

const time = (time: number, format = "%H:%M") => {
  return GLib.DateTime.new_from_unix_local(time).format(format)
}

const isIcon = (icon: string) => {
  const iconTheme = Gtk.IconTheme.get_for_display(Gdk.Display.get_default())
  return iconTheme.has_icon(icon)
}

const fileExists = (path: string) => GLib.file_test(path, GLib.FileTest.EXISTS)

const urgency = (n: AstalNotifd.Notification) => {
  const { LOW, NORMAL, CRITICAL } = AstalNotifd.Urgency

  switch (n.urgency) {
    case LOW:
      return "low"
    case CRITICAL:
      return "critical"
    case NORMAL:
    default:
      return "normal"
  }
}

export default function Notification({
  n,
  showActions = true,
}: {
  n: AstalNotifd.Notification
  showActions?: boolean
}) {
  return (
    <Gtk.Revealer
      $={(self) => {
        setTimeout(() => {
          self.set_reveal_child(true)
        }, 1)
        setTimeout(() => {
          self.set_reveal_child(false)
        }, 5000)
        setTimeout(() => {
          n.dismiss()
        }, 5250)
      }}
      transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
      transitionDuration={250}
    >
      <Gtk.Box
        name={n.id.toString()}
        cssClasses={["notification-container", urgency(n)]}
        halign={Gtk.Align.END}
        hexpand={false}
      >
        <Gtk.Box orientation={Gtk.Orientation.VERTICAL}>
          <Gtk.Box hexpand cssClasses={["header"]}>
            <Gtk.Separator hexpand valign={Gtk.Align.BASELINE_CENTER} />
            <Gtk.Label
              cssClasses={["title"]}
              label={`${n.appName.toLowerCase() || "unknown"}. `}
            />
            <Gtk.Separator hexpand valign={Gtk.Align.BASELINE_CENTER} />
          </Gtk.Box>
          <Gtk.Box hexpand cssClasses={["content"]} spacing={8}>
            {n.image && fileExists(n.image) && (
              <Gtk.Box valign={Gtk.Align.START} cssClasses={["image"]}>
                <overlay heightRequest={60} widthRequest={60}>
                  <Gtk.Picture
                    $type="overlay"
                    canShrink
                    contentFit={Gtk.ContentFit.SCALE_DOWN}
                    file={Gio.File.new_for_path(n.image)}
                  />
                </overlay>
              </Gtk.Box>
            )}
            {n.image && isIcon(n.image) && (
              <Gtk.Box cssClasses={["icon-image"]} valign={Gtk.Align.START}>
                <Gtk.Image
                  iconName={n.image}
                  iconSize={Gtk.IconSize.LARGE}
                  halign={Gtk.Align.CENTER}
                  valign={Gtk.Align.CENTER}
                />
              </Gtk.Box>
            )}
            <Gtk.Box hexpand orientation={Gtk.Orientation.VERTICAL}>
              <Gtk.Label
                ellipsize={Pango.EllipsizeMode.END}
                maxWidthChars={30}
                cssClasses={["summary"]}
                halign={Gtk.Align.START}
                xalign={0}
                label={n.summary}
              />
              {n.body && (
                <Gtk.Label
                  maxWidthChars={30}
                  lines={3}
                  wrap
                  ellipsize={Pango.EllipsizeMode.END}
                  cssClasses={["body"]}
                  halign={Gtk.Align.START}
                  xalign={0}
                  label={n.body.replace(/\s+/g, " ")}
                />
              )}
            </Gtk.Box>
          </Gtk.Box>
          {showActions && (
            <Gtk.Box
              // orientation={Gtk.Orientation.VERTICAL}
              cssClasses={["actions"]}
              spacing={6}
            >
              <Gtk.Button hexpand onClicked={() => n.dismiss()}>
                <Gtk.Label label="dismiss." />
              </Gtk.Button>
              {n.get_actions().map(({ label, id }) => (
                <Gtk.Button hexpand onClicked={() => n.invoke(id)}>
                  <Gtk.Label
                    label={`${label.toLowerCase()}.`}
                    halign={Gtk.Align.CENTER}
                    hexpand
                  />
                </Gtk.Button>
              ))}
            </Gtk.Box>
          )}
        </Gtk.Box>
      </Gtk.Box>
    </Gtk.Revealer>
  )
}
