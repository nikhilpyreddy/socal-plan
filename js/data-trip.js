/* Trip-level data. Edit here; bump TRIP.version on each deploy (shown in the footer and used as the offline cache name). */
const TRIP = deepFreeze({
  title: "SoCal Road Trip",
  eyebrow: "Nov 13 – 17 · Los Angeles → San Diego",
  startIso: "2026-11-13",
  endIso: "2026-11-17",
  version: 1
});

/* Stop types: group drives the colour (explore, food, view, logi); icon names live in icons.js. */
const TYPE_META = deepFreeze({
  park: { group: "explore", label: "Attraction", icon: "park" },
  culture: { group: "explore", label: "Culture", icon: "culture" },
  walk: { group: "explore", label: "Walk", icon: "walk" },
  food: { group: "food", label: "Food", icon: "food" },
  view: { group: "view", label: "Viewpoint", icon: "view" },
  logistics: { group: "logi", label: "Logistics", icon: "logistics" }
});

const STAYS = deepFreeze([
  {
    id: "lawndale", region: "la", city: "Los Angeles", area: "Lawndale",
    dates: "Fri Nov 13 to Sun Nov 15 (2 nights).", nights: 2,
    address: "4432 153rd St, Unit 204, Lawndale, CA",
    bookingUrl: "https://booking.ownerrez.com/18ea66307bbc4ca98220dc7431e04250", bookingLabel: "Booking",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=4432%20153rd%20St%2C%20Lawndale%2C%20CA",
    note: "About 15–20 min from LAX, 25–35 min from Santa Monica, 40–55 min from Universal. You check out Sunday morning, so the luggage rides in the car all day."
  },
  {
    id: "pacific-beach", region: "sd", city: "San Diego", area: "Pacific Beach",
    dates: "Sun Nov 15 (late check-in) until you head back to LA.",
    address: "Near Pacific Beach, about a 12-minute walk to Crystal Pier.",
    bookingUrl: "https://www.airbnb.com/l/xbt72vAp?s=67&unique_share_id=e6c470d1-4a7c-46c9-b403-13095bc5b9ec", bookingLabel: "Airbnb",
    mapUrl: "https://maps.app.goo.gl/7ZGNaq2JdUnGEr1Y7",
    note: "About 20–25 min to La Jolla and Annie's Canyon, 15–20 min to downtown, Old Town and Sunset Cliffs. The Pacific Beach evening on Nov 16 is a walk from the door."
  }
]);

const RETURN_TRIP = deepFreeze({
  id: "return", dateLabel: "Date not set yet", title: "San Diego → Los Angeles",
  summary: "About 115 mi from the Pacific Beach Airbnb to LAX. It takes about 1h 50m with clear roads and 3h+ at rush hour. Since the date is open, pick a departure window that avoids the worst traffic.",
  miles: 115, driveLabel: "1h 50m–3h+", route: "I-5 N → I-405 N",
  routeUrl: "https://www.google.com/maps/dir/?api=1&origin=32.793818%2C-117.248562&destination=LAX&travelmode=driving",
  options: [
    { title: "Best times to leave", body: "On a weekday, leave before 6:30 AM or between 9:30 AM and 1:30 PM. Northbound I-5 / I-405 through Orange County is worst from 2:30 to 7 PM." },
    { title: "Option A: Tue Nov 17, after dinner", body: "Leave Gaslamp around 9 PM and reach LA around 11 PM. Roads are clear, but you need a place to stay in LA that night and should skip the last Airbnb night." },
    { title: "Option B: Wed Nov 18, mid-morning", body: "Check out, leave around 9:30 AM and reach LA around 11:45 AM. This is the most relaxed option." },
    { title: "Scenic detour (+45–60 min)", body: "Leave I-5 at Dana Point and take the Pacific Coast Highway through Laguna Beach and Crystal Cove for lunch with ocean views, then rejoin the I-405 at Irvine or Costa Mesa." },
    { title: "If you are flying out", body: "Plan to reach LAX 2–2.5 h before a domestic flight and 3 h before an international one. Add 30–45 min if you are returning a rental car." },
    { title: "Rest stop", body: "The Aliso Creek rest area on I-5 at Camp Pendleton is the easy halfway break." }
  ]
});

const CHANGES = deepFreeze([
  {title:"Venice Beach → Day 2 morning",body:"It is 0.4 mi from the Canals. The boardwalk is great at 9 AM and not worth it after dark."},
  {title:"Santa Monica after the 6:30 pickup",body:"The pier is right by LAX, so it is the easy first stop after the pickup. At night you get the lit Ferris wheel and a beach dinner."},
  {title:"Day 2 reordered by geography",body:"Venice → Downtown → Beverly Hills → Griffith → Hollywood → dinner. No backtracking across LA."},
  {title:"Hollywood Sign + Griffith = one stop",body:"The observatory terraces have a clear sign view at sunset, which saves a separate 45-min detour."},
  {title:"Dolby & Chinese Theatre → Day 2",body:"Same block as the Walk of Fame. On the 17th you are 2+ hours away in San Diego."},
  {title:"Lunch added at Grand Central Market",body:"It sits between The Broad and the bookstore, and Angels Flight connects them."},
  {title:"Trail day = Nov 16",body:"Annie's Canyon and Torrey Pines open the north-to-south coast run, so there is no extra driving."},
  {title:"Centennial Park → Coronado evening",body:"It is in Coronado, so it pairs naturally with Coronado Beach at blue hour."},
  {title:"Pacific Beach on 16th, Gaslamp on 17th",body:"Your Airbnb is in Pacific Beach, so the 16th is a walk from home after the long Sunday. The big downtown night comes last."},
  {title:"Spruce St Bridge with Balboa Park",body:"They are 5 minutes apart, so it is an easy 20-minute add."}
]);

const TIPS = deepFreeze([
  {title:"Food: chicken, shrimp or vegetarian",body:"On Mexican menus, carnitas and al pastor are pork, and asada and barbacoa are beef. Fish tacos are usually white fish, so ask for shrimp. Chinese dumplings often contain pork even when the name only says shrimp, so check before ordering."},
  {title:"Sunset ≈ 4:50 PM, dark by 5:20",body:"Daylight is the scarcest thing on this trip. Every day puts the outdoor stops before sunset and the city stops after."},
  {title:"Use carpool lanes",body:"With 4 people you qualify for HOV lanes on the 405 and 5. Avoid \"Express Lanes\" unless you have a FasTrak transponder."},
  {title:"Leave nothing visible in the car",body:"Break-ins are common at Griffith, La Jolla Cove and Sunset Cliffs. Put bags in the trunk before you arrive, not after you park."},
  {title:"Weather",body:"Days around 68–72°F, evenings in the mid-50s by the water, ocean about 63°F. Bring a light jacket every day."},
  {title:"Tides matter in San Diego",body:"Sea caves, under-pier photos and tide pools all need low tide. In winter the lowest tides tend to fall in the afternoon."},
  {title:"Parking apps",body:"Most meters in LA and San Diego take ParkMobile or the city app. Set it up before the trip."}
]);

const CHECKLIST = deepFreeze([
  {id:"universal-tickets",text:"Universal tickets for Sat Nov 14 (consider Express on a Saturday)"},
  {id:"broad-reservation",text:"The Broad: free timed reservation, Sun Nov 15 at 11 AM, for everyone"},
  {id:"din-tai-fung",text:"Din Tai Fung Century City, Sun Nov 15 at 7 PM: confirm the headcount for the full group"},
  {id:"lawndale-checkin",text:"Lawndale Airbnb: confirm check-in after 9 PM on Nov 13 and the checkout time on Nov 15"},
  {id:"pb-checkin",text:"Pacific Beach Airbnb: confirm self check-in around 11 PM on Sun Nov 15"},
  {id:"return-date",text:"Decide the return date and time to LA (book a place in LA if you go back on the night of the 17th)"},
  {id:"tide-chart",text:"Check the La Jolla tide chart for Nov 16–17"},
  {id:"offline-maps",text:"Download offline Google Maps areas for LA and San Diego"},
  {id:"nps-pass",text:"Bring an America the Beautiful pass if you have one (Cabrillo)"},
  {id:"shoes-layers",text:"Pack grippy shoes for Annie's Canyon and Sunset Cliffs, plus layers for evenings"},
  {id:"parkmobile",text:"Set up the ParkMobile app with a card"}
]);
