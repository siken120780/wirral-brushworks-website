// Everything here is taken verbatim from the existing Wirral Brushworks
// preview site — see /home/claude/brushworks/AUDIT.md

export const PHONE_DISPLAY = '07521 176717'
export const PHONE_TEL = 'tel:07521176717'
// GHL lead capture — the estimate wizard submits into this form, so every
// lead lands in the CRM with an opportunity + notification
export const GHL_LOCATION_ID = 'Cf9bkc6XeEUsIGWRwVEi'
export const GHL_FORM_ID = '3JCVKrFqAxSUopBqwmSV'
export const GHL_FORM_ENDPOINT = 'https://backend.leadconnectorhq.com/forms/submit'

export const WHATSAPP_URL =
  'https://wa.me/447521176717?text=' +
  encodeURIComponent("Hi, I'd like a quote for some decorating work.")
export const EMAIL = 'hello@wirralbrushworks.co.uk'

export const HOURS = [
  ['Mon – Fri', '8am – 6pm'],
  ['Sat', '9am – 1pm'],
]

// Genuine before/after photos uploaded to the original site (user attachments,
// not AI assets) — real job, real transformation.
export const BEFORE_IMG =
  'https://vibe.filesafe.space/1783158099334096517/attachments/1f936738-4d37-4c01-bdf4-6664c6eaed61.png'
export const AFTER_IMG =
  'https://vibe.filesafe.space/1783158099334096517/attachments/2b2b73c4-868b-4387-8923-17789e0a8d5c.png'

// Estimate wizard — identical steps and price matrix to the existing site.
export const SERVICES_Q = ['Painting', 'Wallpapering', 'Full redecoration', 'Something else']

export const ROOMS_Q = [
  { label: '1 room/area', value: 1 },
  { label: '2 rooms/areas', value: 2 },
  { label: '3 rooms/areas', value: 3 },
  { label: '4 or more rooms/areas', value: 4 },
]

export const SIZES_Q = [
  { label: 'Small', hint: 'e.g. hallway, small bedroom', value: 'Small' },
  { label: 'Medium', hint: 'average room', value: 'Medium' },
  { label: 'Large', hint: 'big or open-plan room', value: 'Large' },
]

export const TIMING_Q = ['Soon', 'In the next few weeks', 'Just getting prices']

// Per room/area [min, max], multiplied by the room count — exactly as the
// existing site calculates it. "Something else" → free site visit instead.
export const PRICE_MATRIX = {
  Painting: { Small: [150, 350], Medium: [250, 500], Large: [400, 800] },
  Wallpapering: { Small: [200, 450], Medium: [350, 700], Large: [600, 1200] },
  'Full redecoration': { Small: [350, 700], Medium: [550, 1100], Large: [900, 1800] },
}
