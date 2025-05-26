import { App, Astal, Gtk, Gdk } from "astal/gtk4"
import { execAsync, Variable } from "astal"

import Workspaces from "../elements/Workspaces"
import State from "../elements/State"

const time = Variable("").poll(1000, ["date", "+%A,\ %B\ %e\ -\ %r"])

// labels for hyprland workspaces. i just use 5
const buttons = [
    {
        label: 'home.',
        symbol: 'graveyard-symbolic'
    },
    {
        label: 'chat.',
        symbol: 'chat-symbolic'
    },
    {
        label: 'code.',
        symbol: 'bash-symbolic'
    },
    {
        label: 'misc.',
        symbol: 'globe-symbolic'
    },
    {
        label: 'play.',
        symbol: 'input-gaming-symbolic'
    },
]

export default function Bar(gdkmonitor: Gdk.Monitor) {
    const { TOP, LEFT, RIGHT } = Astal.WindowAnchor

    return <window
        visible
        cssClasses={["Bar"]}
        gdkmonitor={gdkmonitor}
        exclusivity={Astal.Exclusivity.EXCLUSIVE}
        anchor={TOP | LEFT | RIGHT}
        application={App}>
        <centerbox cssName="centerbox">
            <box spacing={8}>
                <Workspaces buttons={buttons} />
            </box>
            <box>
                <button onClicked={() => execAsync(['walker', '-s', 'red-dark'])}>
                    <box>
                        <label label={time()} />
                    </box>
                </button>
            </box>
            <box>
                <State />
            </box>
        </centerbox>
    </window>
}
