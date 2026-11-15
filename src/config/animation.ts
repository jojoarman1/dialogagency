export const INTRO_DURATION = 2
export const INTRO_EASE = 'power2.out'

// Text rising from its own line (the hero slogan and caption, the menu items)
export const LINE_REVEAL_DURATION = 1.2
export const LINE_REVEAL_EASE = 'sine.out'

// Menu and chat panels growing out of their buttons. An ease-out starts moving on the very first
// frame, so the click feels answered at once; the content starts before the panel lands
export const PANEL_EXPAND_DURATION = 0.65
export const PANEL_EXPAND_EASE = 'power4.out'
export const PANEL_CONTENT_DURATION = 0.3
export const PANEL_CONTENT_HIDE_DURATION = 0.2
export const PANEL_CONTENT_EASE = 'power1.out'
export const PANEL_CONTENT_OVERLAP = 0.3

// Header links gliding to a section of the page
export const SECTION_SCROLL_DURATION = 1.2
export const SECTION_SCROLL_EASE = 'power3.inOut'

// A chat step: after its line is typed out, its controls and options fade in one by one
export const CHAT_CONTROLS_REVEAL = { duration: 0.5, ease: 'power2.out', stagger: 0.08 }
export const CHAT_OPTIONS_REVEAL = { duration: 0.35, ease: 'power1.out', stagger: 0.06 }
// The thanks replacing the form after sending, held long enough to read before the chat closes
export const CHAT_THANKS = { duration: 0.35, ease: 'power1.out', hold: 2 }
// The chat button's label rising from under its line as the button comes back
export const CHAT_LABEL_RISE = { duration: 0.7, ease: 'power3.out' }

// Project photos scroll inside their covers: a photo is this much taller than its cover and
// travels that extra while the cover crosses the screen
export const COVER_SCROLL_OVERSCAN = 0.16
