import gsap from 'gsap'

export const ICON_FLY_SELECTOR = '[data-fly-icon]'
// Past the clip's edge, so the icon is fully hidden before it comes back
const ICON_OFFSET = 120
const ICON_OUT_DURATION = 0.15
const ICON_IN_DURATION = 0.25

// The icon flies out up and to the right of its clip and comes back from the opposite corner
export const createIconFlight = (icon: Element, vars?: gsap.TimelineVars) =>
  gsap
    .timeline(vars)
    .to(icon, {
      xPercent: ICON_OFFSET,
      yPercent: -ICON_OFFSET,
      duration: ICON_OUT_DURATION,
      ease: 'power2.in'
    })
    .set(icon, { xPercent: -ICON_OFFSET, yPercent: ICON_OFFSET })
    .to(icon, {
      xPercent: 0,
      yPercent: 0,
      duration: ICON_IN_DURATION,
      ease: 'power3.out'
    })
