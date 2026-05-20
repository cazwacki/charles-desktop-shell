import app from "ags/gtk4/app"
import style_dark from "./style-dark.scss"
import style_light from "./style-light.scss"
import Bar from "./widget/bar/Bar"
import NotificationPopup from "./widget/notification/NotificationPopup"
import Gio from "gi://Gio"


const user_interface = Gio.Settings.new('org.gnome.desktop.interface');
// Function to update the style based on the current scheme
function updateTheme() {
    const isDark = user_interface.get_string('color-scheme') === 'prefer-dark';
    
    // Swap your CSS file based on the preference
    const cssFile = isDark ? style_dark : style_light;
    app.apply_css(cssFile, true);
}

// Listen for changes
user_interface.connect('changed::color-scheme', updateTheme);

app.start({
  css: style_dark,
  // gtkTheme: "adw-gtk3-dark",
  main() {
    app.get_monitors().map(Bar)
    app.get_monitors().map(NotificationPopup)
  },
})

// Initial theme update
updateTheme();