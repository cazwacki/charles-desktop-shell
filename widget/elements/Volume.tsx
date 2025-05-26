import Wp from "gi://AstalWp"

import { bind } from "astal";
import { execAsync } from "astal/process"
import { Gtk } from "astal/gtk4";


export default function Volume() {
    const wp = Wp.get_default()

    if (!wp) {
        return <box />
    }

    const speaker = wp.audio.defaultSpeaker;
    const popover = new Gtk.Popover();
    popover.child = <box orientation={1}>
        <box>
            <Gtk.Separator hexpand valign={Gtk.Align.BASELINE_CENTER} />
            <label cssClasses={["title"]} label="input." />
            <Gtk.Separator hexpand valign={Gtk.Align.BASELINE_CENTER} />
        </box>
        {bind(wp.audio, 'microphones').as((microphones) => {
            return microphones.map((microphone) =>
                <button cssClasses={["elem"]} onClicked={() => microphone.set_is_default(true)}>
                    <box spacing={8}>
                        <image iconName={bind(microphone, 'isDefault').as((isDefault) => isDefault ? 'audio-input-microphone' : '')} />
                        <label label={bind(microphone, 'description')} ellipsize={3} maxWidthChars={30} />
                    </box>
                </button>
            )
        })}
        <box>
            <Gtk.Separator hexpand valign={Gtk.Align.BASELINE_CENTER} />
            <label cssClasses={["title"]} label="output." />
            <Gtk.Separator hexpand valign={Gtk.Align.BASELINE_CENTER} />
        </box>
        {bind(wp.audio, 'speakers').as((speakers) => {
            return speakers.map((speaker) =>
                <button cssClasses={["elem"]} onClicked={() => speaker.set_is_default(true)}>
                    <box spacing={8}>
                        <image iconName={bind(speaker, 'isDefault').as((isDefault) => isDefault ? 'audio-volume-high' : '')} />
                        <label label={bind(speaker, 'description')} ellipsize={3} maxWidthChars={30} />
                    </box>
                </button>
            );
        })}
        <box cssClasses={["elem"]}>
            <slider
                onChangeValue={(self) => {
                    speaker.volume = self.value;
                }}
                value={bind(speaker, "volume")}
                hexpand
            />
            <label label={bind(speaker, 'volume').as((volume) => `${Math.floor(volume * 100)}%`)} widthChars={4} />
        </box>
        <box>
            <Gtk.Separator hexpand valign={Gtk.Align.BASELINE_CENTER} />
            <label cssClasses={["title"]} label="playback." />
            <Gtk.Separator hexpand valign={Gtk.Align.BASELINE_CENTER} />
        </box>
        {bind(wp.audio, 'streams').as((streams) =>
            streams.map((stream) =>
                <box cssClasses={["elem"]} orientation={1}>
                    <label label={`${stream.description} - ${stream.name}`} ellipsize={3} maxWidthChars={30} />
                    <box>
                        <slider
                            onChangeValue={(self) => {
                                stream.volume = self.value;
                            }}
                            value={bind(stream, "volume")}
                            hexpand
                        />
                        <label label={bind(stream, 'volume').as((volume) => `${Math.floor(volume * 100)}%`)} widthChars={4} />
                    </box>
                </box>
            )
        )}
        <button cssClasses={["popover-app-launcher"]} onClicked={() => {
            execAsync("pwvucontrol")
            popover.popdown()
        }}>
            <box>
                <image iconName="content-loading" />
                <label label="more." />
            </box>
        </button>
    </box>

    return <menubutton cssClasses={["state-button"]}>
        <box spacing={5}>
            <image iconName={bind(speaker, "volumeIcon")} />
            <label label={bind(speaker, 'volume').as((volume) => `${Math.floor(volume * 100)}%`)} />
        </box>
        {popover}
    </menubutton>
}