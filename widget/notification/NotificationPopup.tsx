import { Astal, Gdk, Gtk } from "ags/gtk4";
import AstalNotifd from "gi://AstalNotifd";
import AstalHyprland from "gi://AstalHyprland";
import Notification from "./Notification";
import { createState, For, onCleanup } from "ags";

const hyprland = AstalHyprland.get_default();

export const sendBatch = (batch: string[]) => {
  const cmd = batch
    .filter((x) => !!x)
    .map((x) => `keyword ${x}`)
    .join("; ");

  hyprland.message(`[[BATCH]]/${cmd}`);
};

export default function NotificationPopup(gdkmonitor: Gdk.Monitor) {
  const notifd = AstalNotifd.get_default()

  const [notifications, setNotifications] = createState(
    new Array<AstalNotifd.Notification>(),
  )

  const notifiedHandler = notifd.connect("notified", (_, id, replaced) => {
    const notification = notifd.get_notification(id)

    if (!notification) return

    if (replaced && notifications.peek().some((n) => n.id === id)) {
      setNotifications((ns) => ns.map((n) => (n.id === id ? notification : n)))
    } else {
      console.log("New notification:", notification.appName, notification.summary)
      setNotifications((ns) => [notification, ...ns])
    }
  })

  const resolvedHandler = notifd.connect("resolved", (_, id) => {
    console.log("Resolved notification:", id)
    setNotifications((ns) => ns.filter((n) => n.id !== id))
  })

  onCleanup(() => {
    notifd.disconnect(notifiedHandler)
    notifd.disconnect(resolvedHandler)
  })

  return (
    <window
      title={"notification"}
      cssClasses={["NotificationPopup"]}
      namespace={"notification-popup"}
      $={(self) => onCleanup(() => self.destroy())}
      visible={notifications((ns) => ns.length > 0)}
      gdkmonitor={gdkmonitor}
      anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
    >
      <box orientation={Gtk.Orientation.VERTICAL}>
        <For each={notifications}>
            {(notification) => <Notification n={notification} />}
        </For>
      </box>
    </window>
  );
}