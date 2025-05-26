import { timeout } from "astal";
import { App, Astal, hook, Gdk } from "astal/gtk4";
import AstalNotifd from "gi://AstalNotifd";
import AstalHyprland from "gi://AstalHyprland";
import Notification from "./Notification";

const hyprland = AstalHyprland.get_default();

export const sendBatch = (batch: string[]) => {
  const cmd = batch
    .filter((x) => !!x)
    .map((x) => `keyword ${x}`)
    .join("; ");

  hyprland.message(`[[BATCH]]/${cmd}`);
};

export default function NotificationPopup(gdkmonitor: Gdk.Monitor) {
  const { TOP } = Astal.WindowAnchor;
  const notifd = AstalNotifd.get_default();

  return (
    <window
      title={"notification"}
      cssClasses={["NotificationPopup"]}
      namespace={"notification-popup"}
      setup={(self) => {
        sendBatch([`layerrule animation slide top, ${self.namespace}`]);
        const notificationQueue: number[] = [];
        let isProcessing = false;

        hook(self, notifd, "notified", (_, id: number) => {
          if (
            notifd.dont_disturb &&
            notifd.get_notification(id).urgency != AstalNotifd.Urgency.CRITICAL
          ) {
            return;
          }
          notificationQueue.push(id);
          processQueue();
        });

        hook(self, notifd, "resolved", (_, __) => {
          isProcessing = false;
          self.visible = false;
          timeout(300, () => {
            processQueue();
          });
        });

        function processQueue() {
          if (isProcessing || notificationQueue.length === 0) return;
          isProcessing = true;
          const id = notificationQueue.shift();
          const notification = notifd.get_notification(id!);

          self.visible = true;
          self.set_child(
            <box vertical hexpand>
              {Notification({ n: notification })}
              <box vexpand />
            </box>);

          timeout(10000, () => {
            if (notifd.get_notification(id!) !== null) {
              notification.dismiss()
            }
          });
        }
      }}
      gdkmonitor={gdkmonitor}
      application={App}
      anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
    ></window>
  );
}