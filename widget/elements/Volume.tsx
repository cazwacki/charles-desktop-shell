import Wp from "gi://AstalWp"

import { createBinding, createComputed, For, With } from "ags"
import { execAsync } from "ags/process"
import { Gtk } from "ags/gtk4"

export default function Volume() {
  const wp = Wp.get_default()

  const microphones = createBinding(wp.audio, "microphones")
  const speakers = createBinding(wp.audio, "speakers")
  const streams = createBinding(wp.audio, "streams")

  if (!wp) {
    return <Gtk.Box />
  }

  const speaker = wp.audio.defaultSpeaker
  const volumeIcon = createBinding(speaker, "volumeIcon")
  const volume = createBinding(speaker, "volume")

  const popover = new Gtk.Popover()
  popover.child = (
    <Gtk.Box orientation={Gtk.Orientation.VERTICAL}>
      <Gtk.Box>
        <Gtk.Separator hexpand valign={Gtk.Align.BASELINE_CENTER} />
        <Gtk.Label cssClasses={["title"]} label="input." />
        <Gtk.Separator hexpand valign={Gtk.Align.BASELINE_CENTER} />
      </Gtk.Box>
      <Gtk.Box orientation={Gtk.Orientation.VERTICAL}>
        <For each={microphones}>
          {(microphone) => {
            const isDefault = createBinding(microphone, "isDefault")
            const description = createBinding(microphone, "description")

            return (
              <Gtk.Button
                cssClasses={["elem"]}
                onClicked={() => microphone.set_is_default(true)}
              >
                <Gtk.Box spacing={8}>
                  <Gtk.Box>
                    <With value={isDefault}>
                      {(value) => (
                        <Gtk.Image
                          iconName={value ? "audio-input-microphone" : ""}
                        />
                      )}
                    </With>
                  </Gtk.Box>
                  <Gtk.Box>
                    <With value={description}>
                      {(value) => (
                        <Gtk.Label
                          label={value}
                          ellipsize={3}
                          maxWidthChars={30}
                        />
                      )}
                    </With>
                  </Gtk.Box>
                </Gtk.Box>
              </Gtk.Button>
            )
          }}
        </For>
      </Gtk.Box>
      <Gtk.Box>
        <Gtk.Separator hexpand valign={Gtk.Align.BASELINE_CENTER} />
        <Gtk.Label cssClasses={["title"]} label="output." />
        <Gtk.Separator hexpand valign={Gtk.Align.BASELINE_CENTER} />
      </Gtk.Box>
      <Gtk.Box orientation={Gtk.Orientation.VERTICAL}>
        <For each={speakers}>
          {(speaker) => {
            const isDefault = createBinding(speaker, "isDefault")
            const description = createBinding(speaker, "description")

            return (
              <Gtk.Button
                cssClasses={["elem"]}
                onClicked={() => speaker.set_is_default(true)}
              >
                <Gtk.Box spacing={8}>
                  <Gtk.Box>
                    <With value={isDefault}>
                      {(value) => (
                        <Gtk.Image
                          iconName={value ? "audio-volume-high" : ""}
                        />
                      )}
                    </With>
                  </Gtk.Box>
                  <Gtk.Box>
                    <With value={description}>
                      {(value) => (
                        <Gtk.Label
                          label={value}
                          ellipsize={3}
                          maxWidthChars={30}
                        />
                      )}
                    </With>
                  </Gtk.Box>
                </Gtk.Box>
              </Gtk.Button>
            )
          }}
        </For>
      </Gtk.Box>
      <Gtk.Box cssClasses={["elem"]}>
        <slider
          onChangeValue={(self) => {
            speaker.volume = self.value
          }}
          value={volume}
          hexpand
        />
        <Gtk.Label
          label={volume.as((volume) => `${Math.floor(volume * 100)}%`)}
          widthChars={4}
        />
      </Gtk.Box>
      <Gtk.Box>
        <Gtk.Separator hexpand valign={Gtk.Align.BASELINE_CENTER} />
        <Gtk.Label cssClasses={["title"]} label="playback." />
        <Gtk.Separator hexpand valign={Gtk.Align.BASELINE_CENTER} />
      </Gtk.Box>
      <Gtk.Box orientation={Gtk.Orientation.VERTICAL}>
        <For each={streams}>
          {(stream) => {
            const volume = createBinding(stream, "volume")
            const description = createBinding(stream, "description")
            const name = createBinding(stream, "name")
            const streamTitle = createComputed(() => {
              return `${description()} - ${name()}`
            })

            return (
              <Gtk.Box cssClasses={["elem"]} orientation={1}>
                <Gtk.Box>
                  <With value={streamTitle}>
                    {(value) => (
                      <Gtk.Label
                        label={value}
                        ellipsize={3}
                        maxWidthChars={30}
                      />
                    )}
                  </With>
                </Gtk.Box>
                <Gtk.Box>
                  <slider
                    onChangeValue={(self) => {
                      stream.volume = self.value
                    }}
                    value={volume}
                    hexpand
                  />
                  <With value={volume}>
                    {(value) => (
                      <Gtk.Label
                        label={`${Math.floor(value * 100)}%`}
                        widthChars={4}
                      />
                    )}
                  </With>
                </Gtk.Box>
              </Gtk.Box>
            )
          }}
        </For>
      </Gtk.Box>
      <Gtk.Button
        cssClasses={["popover-app-launcher"]}
        onClicked={() => {
          execAsync("pwvucontrol")
          popover.popdown()
        }}
      >
        <Gtk.Box>
          <Gtk.Image iconName="content-loading" />
          <Gtk.Label label="more." />
        </Gtk.Box>
      </Gtk.Button>
    </Gtk.Box>
  )

  return (
    <Gtk.MenuButton cssClasses={["state-button"]}>
      <Gtk.Box spacing={5}>
        <With value={volumeIcon}>
          {(value) => <Gtk.Image iconName={value} />}
        </With>
        <With value={volume}>
          {(value) => <Gtk.Label label={`${Math.floor(value * 100)}%`} />}
        </With>
      </Gtk.Box>
      {popover}
    </Gtk.MenuButton>
  )
}
