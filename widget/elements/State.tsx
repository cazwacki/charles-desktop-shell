import Battery from "gi://AstalBattery"
import Bluetooth from "gi://AstalBluetooth"
import Volume from "./Volume"
import Network from "gi://AstalNetwork"

import { execAsync } from "ags/process"
import { createBinding, With } from "ags"
import { Gtk } from "ags/gtk4"

const network = Network.get_default()
const bluetooth = Bluetooth.get_default()
const battery = Battery.get_default()

function BatteryImage() {
  const icon_level = Math.floor(battery.percentage * 10) * 10
  let battery_icon = `battery-level-${icon_level}-symbolic`

  return <Gtk.Image iconName={battery_icon} />
}

function NetworkImage() {
  let network_icon = ""
  switch (network.primary) {
    case Network.Primary.UNKNOWN:
      network_icon = "network-no-route-symbolic"
    case Network.Primary.WIFI:
      network_icon = "network-wireless-symbolic"
    case Network.Primary.WIRED:
      network_icon = "network-wired-symbolic"
  }
  return <Gtk.Image iconName={network_icon} />
}

function PrimaryNetwork() {
  let network_icon = ""
  let network_text
  switch (network.primary) {
    case Network.Primary.UNKNOWN:
      network_icon = "network-no-route-symbolic"
      network_text = "unknown."
    case Network.Primary.WIFI:
      network_icon = "network-wireless-symbolic"
      network_text = network.wifi.activeAccessPoint.get_ssid() || ""
    case Network.Primary.WIRED:
      network_icon = "network-wired-symbolic"
      network_text = network.wired.device.activeConnection.id
  }
  return (
    <Gtk.Box spacing={8} marginStart={8} marginEnd={8} marginBottom={8}>
      <Gtk.Image iconName={network_icon} />
      <Gtk.Label label={network_text} />
    </Gtk.Box>
  )
}

function BluetoothImage() {
  const isPowered = createBinding(bluetooth, "isPowered")
  return (
    <With value={isPowered}>
      {(isPowered) => (
        <Gtk.Image
          iconName={
            isPowered
              ? "bluetooth-active-symbolic"
              : "bluetooth-disabled-symbolic"
          }
        />
      )}
    </With>
  )
}

export default function State() {
  const popover = new Gtk.Popover()
  popover.child = (
    <Gtk.Box orientation={1}>
      <Gtk.Box marginTop={8} hexpand halign={Gtk.Align.BASELINE_CENTER}>
        <BatteryImage />
        <Gtk.Label
          label={createBinding(battery, "batteryLevel").as(
            (batteryLevel) => `${Math.floor(batteryLevel * 100)}%`,
          )}
        />
        <Gtk.Label
          label={createBinding(battery, "charging").as((charging) =>
            charging
              ? battery.batteryLevel === 1
                ? "fully charged."
                : `${Math.floor(battery.timeToFull / 60)} mins. to full`
              : `${Math.floor(battery.timeToEmpty / 60)} mins. remain`,
          )}
        />
      </Gtk.Box>
      <Gtk.Box>
        <Gtk.Separator hexpand valign={Gtk.Align.BASELINE_CENTER} />
        <Gtk.Label cssClasses={["title"]} label="connections." />
        <Gtk.Separator hexpand valign={Gtk.Align.BASELINE_CENTER} />
      </Gtk.Box>
      <PrimaryNetwork />
      <Gtk.Button
        onClicked={() => {
          execAsync(["iwgtk"])
          popover.popdown()
        }}
      >
        <Gtk.Box>
          <Gtk.Image iconName="network-wireless-symbolic" />
          <Gtk.Label label="Manage Wi-Fi" />
        </Gtk.Box>
      </Gtk.Button>
      <Gtk.Button
        onClicked={() => {
          execAsync(["blueman-manager"])
          popover.popdown()
        }}
      >
        <Gtk.Box>
          <Gtk.Image iconName="bluetooth-symbolic" />
          <Gtk.Label label="Manage Bluetooth" />
        </Gtk.Box>
      </Gtk.Button>
    </Gtk.Box>
  )
  return (
    <Gtk.Box spacing={5}>
      <Volume />
      <Gtk.MenuButton cssClasses={["state-button"]}>
        <Gtk.Box spacing={5}>
          <NetworkImage />
          <BluetoothImage />
          <BatteryImage />
        </Gtk.Box>
        {popover}
      </Gtk.MenuButton>
    </Gtk.Box>
  )
}
