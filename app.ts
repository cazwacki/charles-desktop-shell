import { App } from "astal/gtk4"
import style from "./style.scss"
import Bar from "./widget/bar/Bar"
import NotificationPopup from "./widget/notification/NotificationPopup"

App.start({
    css: style,
    main() {
        App.get_monitors().map(Bar)
        App.get_monitors().map(NotificationPopup)
    },
})
