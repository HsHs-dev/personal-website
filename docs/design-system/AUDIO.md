# Environmental audio — source and playback specification

Part of [Hassan’s design system](../DESIGN_SYSTEM.md). Source metadata checked 17 November 2026. No audio files were downloaded, edited, or auditioned during this documentation pass. The following are concrete, license-checked **audition candidates**, not a claim that the finished loops already exist or sound right together.

## Source manifest

All four source pages identify their recording as Creative Commons 0. [CC0’s official summary](https://creativecommons.org/publicdomain/zero/1.0/) permits copying and modification without requesting permission; retain creator credits voluntarily and preserve source/license records. Freesound may require sign-in to download the originals. These are direct source-page links, not invented CDN files or generic search pages.

| ID | Exact recording / creator / source | Verified original metadata | Proposed role and edit | Audition condition |
|---|---|---|---|---|
| breeze | [Autumn wind and dry leaves.wav — Stek59](https://freesound.org/people/Stek59/sounds/457318/) | CC0; 42.913s; stereo WAV, 48kHz, 24-bit | Home air; quieter About window air; very low Garden secondary layer. Select a stable 24–36s passage; trim abrupt rustles; gentle low-pass if needed. | Source describes dry leaves on sidewalks and possible rain-like background noise. Reject if it sounds like footsteps, traffic, or a storm rather than soft air. |
| rain | [Rain_01.wav — Q.K.](https://freesound.org/people/Q.K./sounds/56306/) | CC0; 25.761s; stereo WAV, 44.1kHz, 16-bit | Library winter-window rain. Make a roughly 20–24s loop, softened above approximately 5kHz to suggest distance through glass. | Listen for distinctive drops, hiss, or repeating events that become distracting. The low-pass frequency is a starting proposal, not a verified edit. |
| stream | [STREAM — SamuelGremaud](https://freesound.org/people/SamuelGremaud/sounds/437063/) | CC0; 29.978s; stereo WAV, 48kHz, 32-bit | Garden water, also retained quietly on Garden entries. Approximately 24–28s loop; gentle filtering of rumble if present. | Reject if the water feels forceful, harsh, or tiring after several minutes. It should support the pond scene rather than suggest a waterfall. |
| leaves | [LEAVES.wav — nicoproson](https://freesound.org/people/nicoproson/sounds/631406/) | CC0; 27.167s; stereo WAV, 48kHz, 24-bit | Optional 0.4–0.8s leaf rustle when deliberately entering Garden; select a small isolated gesture. | Source is movement of a dry-leaf bush. Omit if no gentle, clean passage works. Never fire it on every hover or link. |

No music, cartoon/game voices, musical chimes, synthetic success beeps, or exaggerated creaking doors. Sunlight is represented visually. Fireflies do not get invented buzzing sounds. Initial version has no separate paper, mug, latch, or typing effects; those are deliberate omissions, not unsourced assets waiting to be filled.

## Proposed room mix

Numbers below are relative Web Audio gain targets for edited masters, not a guaranteed perceived loudness. First prepare masters at a consistent approximate loudness around -20 LUFS integrated, with true peaks no higher than -3dBTP, then audition the actual mix. These are practical initial targets, not an accessibility standard or a requirement to normalize noisy recordings aggressively.

The user volume slider is a separate master gain (default 50% after opt-in); changes must ramp smoothly. The table specifies the layer gain **before** that master. `gain = 10^(dB/20)`.

| Route / state | Layers | Initial gain before master | Change on entry |
|---|---|---|---|
| Loading | none | silence | Never initiates playback |
| Home day | breeze | -16dB ≈ 0.158 | Fade in 1000ms after explicit enabling |
| Home night | same breeze | -20dB = 0.100 | Ramp from day over 600ms, do not restart the loop |
| About | breeze | -23dB ≈ 0.071 | Crossfade to a quieter window-distance treatment |
| Work and project pages | none | silence | Fade previous ambience out over 400ms |
| Library and book records | rain | -18dB ≈ 0.126 | 1000ms fade in; 400ms fade out |
| Garden index / topic | stream + breeze | -18dB + -28dB | 1000ms crossfade; stream remains dominant |
| Garden article / recipe / media | stream only | -24dB ≈ 0.063 | Breeze fades out; water recedes for reading |
| Garden door entry | leaves, optional | -22dB ≈ 0.079 | One shot at about 280ms into entry, only if already enabled |
| Contact / Search / Colophon / Accessibility / 404 / error | none | silence | Fade to silence; never signal an error with sound |

A sound setting being on does not mean every route must make sound. Local panels, selected books, filters, and ordinary buttons are silent. No ambience changes on pointer hover.

## Loop and delivery requirements

- Edit loop points by listening across the seam. Start with a 1.5–2.5s equal-power overlap, adjusting until it avoids both clicks and audible swells. Do not assume the source is already seamless.
- Verify repeated playback for at least five cycles; inspect peaks and stereo image; audition quietly on headphones, laptop, and phone. Reject spoken voices, startling transients, recognizable copyrighted background music, and obvious loop signatures.
- Export an Opus version and an AAC or MP3 fallback, generally 64–96kbps for stereo ambience. Choose the actual codec combination after browser support testing. Keep uncompressed source masters outside the initial web payload.
- Target ≤450KB for each web loop and ≤25KB for the leaf gesture; these are delivery budgets to measure after encoding. No request for audio until the user enables it. Load only the current room’s assets, with cancellation for abandoned navigation.
- No hotlinking the Freesound preview into production. Import the selected, edited assets into the project with an asset manifest containing title, author, source URL, source license, download date, checksum, edit description, and final filename.
- Retain consistent gain and cap simultaneous layers at two ambience tracks plus one optional one-shot. Do not stack new copies on React remounts or route transitions.

## Playback behavior

Default state is **Sound off**. Show a labelled Sound button and a preference slider. Remember the preference locally if storage is available, but begin a new visit quietly until a user gesture successfully activates playback. Browser audio policies can reject play/resume; handle that by keeping the UI off or offering “Enable sound,” not by silently retrying. [MDN autoplay guide](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay)

Mute cancels one-shots and fades master to zero within 80ms. Navigating away fades/cleans up the prior room. Pause while the document is hidden; resume only if the user had enabled audio, the page is visible, and browser playback permits it. Prefer a fresh gentle fade on return over an abrupt restart. Closing a room or unmounting the sound manager disposes sources/listeners and prevents late async loads from starting audio.

Audio download failure should leave a functional silent page and a small status in Preferences: “Sound unavailable. Retry.” It is never a blocking modal. Reduced motion and sound are independent settings; disabling motion does not automatically enable or disable audio. No content is conveyed only by sound.

## Credit format for the final Colophon

Use this only for assets actually shipped, with edits accurately filled in:

> “STREAM” by SamuelGremaud, via Freesound, CC0 1.0. Edited for this site: trimmed, looped, and volume-adjusted. [Original recording](https://freesound.org/people/SamuelGremaud/sounds/437063/) · [License](https://creativecommons.org/publicdomain/zero/1.0/)

The same format applies to the other three candidates. Do not claim “recorded by Hassan” or imply endorsement by the recordists. Choosing a different asset later requires a new source/license entry and another listening pass.
