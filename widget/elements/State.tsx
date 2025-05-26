import Battery from "gi://AstalBattery"
import Bluetooth from "gi://AstalBluetooth";
import Volume from "./Volume"
import Network from "gi://AstalNetwork";

import { bind, execAsync } from "astal";
import { Gtk } from "astal/gtk4";

const network = Network.get_default()
const bluetooth = Bluetooth.get_default()
const battery = Battery.get_default()

function BatteryImage() {
    const icon_level = Math.floor(battery.percentage * 10) * 10
    let battery_icon = `battery-level-${icon_level}-symbolic`

    return <image iconName={battery_icon} />
}

function NetworkImage() {
    let network_icon = ''
    switch (network.primary) {
        case Network.Primary.UNKNOWN:
            network_icon = 'network-no-route-symbolic'
        case Network.Primary.WIFI:
            network_icon = 'network-wireless-symbolic'
        case Network.Primary.WIRED:
            network_icon = 'network-wired-symbolic'
    }
    return <image iconName={network_icon} />
}

function PrimaryNetwork() {
    let network_icon = ''
    let network_text
    switch (network.primary) {
        case Network.Primary.UNKNOWN:
            network_icon = 'network-no-route-symbolic'
            network_text = 'unknown.'
        case Network.Primary.WIFI:
            network_icon = 'network-wireless-symbolic'
            network_text = network.wifi.activeAccessPoint.get_ssid() || '';
        case Network.Primary.WIRED:
            network_icon = 'network-wired-symbolic'
            network_text = network.wired.device.activeConnection.id;
    }
    return <box spacing={8} marginStart={8} marginEnd={8} marginBottom={8}>
        <image iconName={network_icon} />
        <label label={network_text} />
    </box>
}

function BluetoothImage() {
    return bind(bluetooth, "isPowered").as((isPowered) => {
        return <image iconName={isPowered ? 'bluetooth-active-symbolic' : 'bluetooth-disabled-symbolic'} />
    })
}

export default function State() {
    const popover = new Gtk.Popover()
    popover.child = <box orientation={1}>
        <box marginTop={8} hexpand halign={Gtk.Align.BASELINE_CENTER}>
            <BatteryImage />
            <label label={bind(battery, 'batteryLevel').as((batteryLevel) => `${Math.floor(batteryLevel * 100)}%`)} />
            <label label={bind(battery, 'charging').as((charging) => charging ? (battery.batteryLevel === 1 ? 'fully charged.' : `${Math.floor(battery.timeToFull / 60)} mins. to full`) : `${Math.floor(battery.timeToEmpty / 60)} mins. remain`)} />
        </box>
        <box>
            <Gtk.Separator hexpand valign={Gtk.Align.BASELINE_CENTER} />
            <label cssClasses={["title"]} label="connections." />
            <Gtk.Separator hexpand valign={Gtk.Align.BASELINE_CENTER} />
        </box>
        <PrimaryNetwork />
        <button onClicked={() => {
            execAsync(['iwgtk'])
            popover.popdown()
        }}>
            <box>
                <image iconName='network-wireless-symbolic' />
                <label label="Manage Wi-Fi" />
            </box>
        </button>
        <button onClicked={() => {
            execAsync(['blueman-manager'])
            popover.popdown()
        }}>
            <box>
                <image iconName='bluetooth-symbolic' />
                <label label="Manage Bluetooth" />
            </box>
        </button>
    </box>
    return <box spacing={5}>
        <Volume />
        <menubutton cssClasses={["state-button"]}>
            <box spacing={5}>
                <NetworkImage />
                <BluetoothImage />
                <BatteryImage />
            </box>
            {popover}
        </menubutton>
    </box >
}