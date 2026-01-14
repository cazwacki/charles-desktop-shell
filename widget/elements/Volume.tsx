import Wp from "gi://AstalWp"

import { createBinding, For, With } from "ags";
import { execAsync } from "ags/process"
import { Gtk } from "ags/gtk4";


export default function Volume() {
    const wp = Wp.get_default()

    const microphones = createBinding(wp.audio, 'microphones')
    const speakers = createBinding(wp.audio, 'speakers');
    const streams = createBinding(wp.audio, 'streams');

    if (!wp) {
        return <box />
    }

    const speaker = wp.audio.defaultSpeaker;
    const volumeIcon = createBinding(speaker, "volumeIcon");
    const volume = createBinding(speaker, "volume");

    const popover = new Gtk.Popover();
    popover.child = <box orientation={1}>
        <box>
            <Gtk.Separator hexpand valign={Gtk.Align.BASELINE_CENTER} />
            <label cssClasses={["title"]} label="input." />
            <Gtk.Separator hexpand valign={Gtk.Align.BASELINE_CENTER} />
        </box>
            <For each={microphones}>
                {
                    (microphone) => {
                        const isDefault = createBinding(microphone, 'isDefault');
                        const description = createBinding(microphone, 'description');

                        return <button cssClasses={["elem"]} onClicked={() => microphone.set_is_default(true)}>
                            <box spacing={8}>
                                <With value={isDefault}>
                                    {(value) => <image iconName={value ? 'audio-input-microphone' : ''} />}
                                </With>
                                <With value={description}>
                                    {(value) => <label label={value} ellipsize={3} maxWidthChars={30} />}
                                </With>
                            </box>
                        </button>
                    }
                }
            </For>
        <box>
            <Gtk.Separator hexpand valign={Gtk.Align.BASELINE_CENTER} />
            <label cssClasses={["title"]} label="output." />
            <Gtk.Separator hexpand valign={Gtk.Align.BASELINE_CENTER} />
        </box>
        <For each={speakers}>
            {
                (speaker) => {
                    const isDefault = createBinding(speaker, 'isDefault');
                    const description = createBinding(speaker, 'description');

                    return <button cssClasses={["elem"]} onClicked={() => speaker.set_is_default(true)}>
                        <box spacing={8}>
                            <With value={isDefault}>
                                {(value) => <image iconName={value ? 'audio-volume-high' : ''} />}
                            </With>
                            <With value={description}>
                                {(value) => <label label={value} ellipsize={3} maxWidthChars={30} />}
                            </With>
                        </box>
                    </button>

                }
            }
        </For>
        <box cssClasses={["elem"]}>
            <slider
                onChangeValue={(self) => {
                    speaker.volume = self.value;
                }}
                value={volume}
                hexpand
            />
            <label label={volume.as((volume) => `${Math.floor(volume * 100)}%`)} widthChars={4} />
        </box>
        <box>
            <Gtk.Separator hexpand valign={Gtk.Align.BASELINE_CENTER} />
            <label cssClasses={["title"]} label="playback." />
            <Gtk.Separator hexpand valign={Gtk.Align.BASELINE_CENTER} />
        </box>
        <For each={streams}>
            {
                (stream) => {
                    const volume = createBinding(stream, "volume");
                    const description = createBinding(stream, 'description');
                    const name = createBinding(stream, 'name');

                    return <box cssClasses={["elem"]} orientation={1}>
                        <label label={`${description()} - ${name()}`} ellipsize={3} maxWidthChars={30} />
                        <box>
                            <slider
                                onChangeValue={(self) => {
                                    stream.volume = self.value;
                                }}
                                value={volume}
                                hexpand
                            />
                            <label label={`${Math.floor(volume() * 100)}%`} widthChars={4} />
                        </box>
                    </box>
                }
            }
        </For>
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
            <With value={volumeIcon}>
                {(value) => <image iconName={value} />}
            </With>
            <With value={volume}>
                {(value) => <label label={`${Math.floor(value * 100)}%`} />}
            </With>
        </box>
        {popover}
    </menubutton>
}