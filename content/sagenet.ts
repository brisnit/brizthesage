/**
 * SageNet: the fictional dial-up portal on the living-room computer.
 * Guestbook entries are clearly fictional residents of the house.
 * House field notes come from content/lore.ts; "About the Resident" uses the
 * real short bio from content/site.ts.
 */

export const sagenetCopy = {
  connecting: [
    "ATDT 555-0177",
    "CONNECT 56000",
    "Negotiating with the house…",
    "Handshake accepted (it was a bony hand)",
  ],
  welcome: ["SAGENET", "A local connection to somewhere unusual.", "", "You are online.", "The house has been expecting company."],
  menu: {
    resident: "About the Resident",
    notes: "House Field Notes",
    guestbook: "Guestbook",
    lostFound: "Lost & Found",
    logOff: "Log Off, Stay Awhile",
  },
  guestbook: [
    // Part of the hidden trail (content/hunt.ts): points to the “Bottled weather” drawer.
    { name: "baboo_baboo", text: "who moved my record. i left it where the house keeps its weather. you know which one." },
    { name: "the_moon", text: "lovely sound tonight. left a little light outside." },
    { name: "cloud_w_face", text: "i can see the roof from here. looks good." },
    { name: "downstairs_neighbor", text: "bass sounds great down here. ceiling less great." },
    { name: "house_admin", text: "Reminder: the guestbook is not an acceptable place to settle the three-dollar situation." },
  ],
  guestbookNote: "(Fictional residents. Signing is disabled.)",
  /** Consistent with the real puzzle: the relic numbers, dialed in solution order, are the phone secret. */
  lostFound: "Three relics are missing. Every relic carries a number. The phone is listening for them.",
  lostFoundLink: "Open the Lost & Found cabinet",
};
