import app from "ags/gtk4/app"
import style from "./style.scss"
import Bar from "./widget/bar/Bar"
import NotificationPopup from "./widget/notification/NotificationPopup"


app.start({
  css: style,
  // gtkTheme: "adw-gtk3-dark",
  main() {
    app.get_monitors().map(Bar)
    // app.get_monitors().map(NotificationPopup)
  },
})
