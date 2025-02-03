/* ----------------------------
 Floor Plan Data
 For each size, there are 7 option variants (Option 1 ... Option 7).
 Each plan defines:
   - outer dimensions (in feet)
   - a scale (pixels per foot)
   - wall definitions (outer walls will be rendered with a light gray fill simulating wall thickness)
   - internal walls (dashed lines)
   - doors (with realistic swing arcs)
   - windows (blue rectangles with borders)
   - room labels with center coordinates (in feet)
   - details text for specifications
---------------------------- */
const planData = {
  "25x25": [
    {
      name: "Option 1",
      outerWidth: 25,
      outerHeight: 25,
      scale: 15,
      walls: [
        // Outer walls defined implicitly by outerWidth/Height and wall thickness
        // Internal walls:
        { x1: 0.5, y1: 15, x2: 25 - 0.5, y2: 15, type: "internal" },
        { x1: 15, y1: 15, x2: 15, y2: 25 - 0.5, type: "internal" },
      ],
      doors: [{ x: 11.5, y: 0, width: 2, orientation: "horizontal" }],
      windows: [
        { x: 2, y: 0, width: 4, orientation: "horizontal" },
        { x: 25 - 6, y: 0, width: 4, orientation: "horizontal" },
      ],
      rooms: [
        { name: "Living", cx: 12.5, cy: 7 },
        { name: "Kitchen", cx: 7, cy: 20 },
        { name: "Bath", cx: 20, cy: 20 },
      ],
      details:
        "Size: 25 x 25 ft | Area: 625 sqft | Rooms: 3 | Doors: 1 | Windows: 2",
    },
    {
      name: "Option 2",
      outerWidth: 25,
      outerHeight: 25,
      scale: 15,
      walls: [
        { x1: 0.5, y1: 12, x2: 25 - 0.5, y2: 12, type: "internal" },
        { x1: 12, y1: 12, x2: 12, y2: 25 - 0.5, type: "internal" },
      ],
      doors: [{ x: 10, y: 0, width: 3, orientation: "horizontal" }],
      windows: [
        { x: 2, y: 0, width: 4, orientation: "horizontal" },
        { x: 25 - 6, y: 0, width: 4, orientation: "horizontal" },
      ],
      rooms: [
        { name: "Lounge", cx: 12.5, cy: 5 },
        { name: "Dining", cx: 18, cy: 18 },
        { name: "WC", cx: 8, cy: 18 },
      ],
      details:
        "Size: 25 x 25 ft | Area: 625 sqft | Rooms: 3 | Doors: 1 | Windows: 2",
    },
    {
      name: "Option 3",
      outerWidth: 25,
      outerHeight: 25,
      scale: 15,
      walls: [
        { x1: 0.5, y1: 16, x2: 25 - 0.5, y2: 16, type: "internal" },
        { x1: 16, y1: 16, x2: 16, y2: 25 - 0.5, type: "internal" },
      ],
      doors: [{ x: 12, y: 0, width: 2.5, orientation: "horizontal" }],
      windows: [
        { x: 2, y: 0, width: 3.5, orientation: "horizontal" },
        { x: 25 - 5, y: 0, width: 3.5, orientation: "horizontal" },
      ],
      rooms: [
        { name: "Family", cx: 12.5, cy: 8 },
        { name: "Study", cx: 20, cy: 20 },
        { name: "Bath", cx: 8, cy: 20 },
      ],
      details:
        "Size: 25 x 25 ft | Area: 625 sqft | Rooms: 3 | Doors: 1 | Windows: 2",
    },
    {
      name: "Option 4",
      outerWidth: 25,
      outerHeight: 25,
      scale: 15,
      walls: [
        { x1: 0.5, y1: 14, x2: 25 - 0.5, y2: 14, type: "internal" },
        { x1: 10, y1: 14, x2: 10, y2: 25 - 0.5, type: "internal" },
      ],
      doors: [{ x: 11, y: 0, width: 2, orientation: "horizontal" }],
      windows: [
        { x: 2, y: 0, width: 4.5, orientation: "horizontal" },
        { x: 25 - 6.5, y: 0, width: 4.5, orientation: "horizontal" },
      ],
      rooms: [
        { name: "Lounge", cx: 12.5, cy: 7 },
        { name: "Kitchen", cx: 7, cy: 20 },
        { name: "Bath", cx: 18, cy: 20 },
      ],
      details:
        "Size: 25 x 25 ft | Area: 625 sqft | Rooms: 3 | Doors: 1 | Windows: 2",
    },
    {
      name: "Option 5",
      outerWidth: 25,
      outerHeight: 25,
      scale: 15,
      walls: [
        { x1: 0.5, y1: 13, x2: 25 - 0.5, y2: 13, type: "internal" },
        { x1: 15, y1: 13, x2: 15, y2: 25 - 0.5, type: "internal" },
      ],
      doors: [{ x: 11.5, y: 0, width: 2, orientation: "horizontal" }],
      windows: [
        { x: 2.5, y: 0, width: 4, orientation: "horizontal" },
        { x: 25 - 6.5, y: 0, width: 4, orientation: "horizontal" },
      ],
      rooms: [
        { name: "Living", cx: 12.5, cy: 6 },
        { name: "Dining", cx: 19, cy: 19 },
        { name: "Bath", cx: 8, cy: 19 },
      ],
      details:
        "Size: 25 x 25 ft | Area: 625 sqft | Rooms: 3 | Doors: 1 | Windows: 2",
    },
    {
      name: "Option 6",
      outerWidth: 25,
      outerHeight: 25,
      scale: 15,
      walls: [
        { x1: 0.5, y1: 17, x2: 25 - 0.5, y2: 17, type: "internal" },
        { x1: 17, y1: 17, x2: 17, y2: 25 - 0.5, type: "internal" },
      ],
      doors: [{ x: 12, y: 0, width: 2.5, orientation: "horizontal" }],
      windows: [
        { x: 2, y: 0, width: 4, orientation: "horizontal" },
        { x: 25 - 6, y: 0, width: 4, orientation: "horizontal" },
      ],
      rooms: [
        { name: "Family", cx: 12.5, cy: 8 },
        { name: "Office", cx: 20, cy: 20 },
        { name: "Bath", cx: 8, cy: 20 },
      ],
      details:
        "Size: 25 x 25 ft | Area: 625 sqft | Rooms: 3 | Doors: 1 | Windows: 2",
    },
    {
      name: "Option 7",
      outerWidth: 25,
      outerHeight: 25,
      scale: 15,
      walls: [
        { x1: 0.5, y1: 15, x2: 25 - 0.5, y2: 15, type: "internal" },
        { x1: 15, y1: 0.5, x2: 15, y2: 15, type: "internal" },
      ],
      doors: [{ x: 11, y: 0, width: 3, orientation: "horizontal" }],
      windows: [
        { x: 3, y: 0, width: 4, orientation: "horizontal" },
        { x: 25 - 7, y: 0, width: 4, orientation: "horizontal" },
      ],
      rooms: [
        { name: "Living", cx: 12.5, cy: 7 },
        { name: "Kitchen", cx: 7, cy: 18 },
        { name: "Bath", cx: 18, cy: 18 },
      ],
      details:
        "Size: 25 x 25 ft | Area: 625 sqft | Rooms: 3 | Doors: 1 | Windows: 2",
    },
  ],
  "25x40": [
    // Two base variants have been created previously. Here we add 7 options with small variations.
    {
      name: "Option 1",
      outerWidth: 25,
      outerHeight: 40,
      scale: 15,
      walls: [
        { x1: 0.5, y1: 6, x2: 25 - 0.5, y2: 6, type: "internal" },
        { x1: 0.5, y1: 20, x2: 25 - 0.5, y2: 20, type: "internal" },
        { x1: 15, y1: 6, x2: 15, y2: 20, type: "internal" },
        { x1: 0.5, y1: 30, x2: 25 - 0.5, y2: 30, type: "internal" },
        { x1: 15, y1: 20, x2: 15, y2: 30, type: "internal" },
      ],
      doors: [{ x: 11.5, y: 0, width: 2, orientation: "horizontal" }],
      windows: [
        { x: 2, y: 0, width: 4, orientation: "horizontal" },
        { x: 25 - 6, y: 0, width: 4, orientation: "horizontal" },
      ],
      rooms: [
        { name: "Foyer", cx: 7.5, cy: 3 },
        { name: "Living", cx: 7.5, cy: 13 },
        { name: "Dining", cx: 20, cy: 13 },
        { name: "Kitchen", cx: 7.5, cy: 25 },
        { name: "Master", cx: 20, cy: 25 },
        { name: "Family", cx: 12.5, cy: 35 },
      ],
      details:
        "Size: 25 x 40 ft | Area: 1000 sqft | Rooms: 6 | Doors: 1 | Windows: 2",
    },
    {
      name: "Option 2",
      outerWidth: 25,
      outerHeight: 40,
      scale: 15,
      walls: [
        { x1: 0.5, y1: 8, x2: 25 - 0.5, y2: 8, type: "internal" },
        { x1: 0.5, y1: 24, x2: 25 - 0.5, y2: 24, type: "internal" },
        { x1: 15, y1: 8, x2: 15, y2: 24, type: "internal" },
      ],
      doors: [{ x: 11.5, y: 0, width: 2, orientation: "horizontal" }],
      windows: [
        { x: 2, y: 0, width: 4, orientation: "horizontal" },
        { x: 25 - 6, y: 0, width: 4, orientation: "horizontal" },
      ],
      rooms: [
        { name: "Entry/Living", cx: 12.5, cy: 4 },
        { name: "Living", cx: 7.5, cy: 16 },
        { name: "Dining", cx: 20, cy: 16 },
        { name: "Kitchen", cx: 7.5, cy: 32 },
        { name: "Bed", cx: 20, cy: 32 },
      ],
      details:
        "Size: 25 x 40 ft | Area: 1000 sqft | Rooms: 5 | Doors: 1 | Windows: 2",
    },
    {
      name: "Option 3",
      outerWidth: 25,
      outerHeight: 40,
      scale: 15,
      walls: [
        { x1: 0.5, y1: 10, x2: 25 - 0.5, y2: 10, type: "internal" },
        { x1: 0.5, y1: 26, x2: 25 - 0.5, y2: 26, type: "internal" },
        { x1: 15, y1: 10, x2: 15, y2: 26, type: "internal" },
      ],
      doors: [{ x: 11, y: 0, width: 3, orientation: "horizontal" }],
      windows: [
        { x: 2, y: 0, width: 4.5, orientation: "horizontal" },
        { x: 25 - 6.5, y: 0, width: 4.5, orientation: "horizontal" },
      ],
      rooms: [
        { name: "Lobby", cx: 12.5, cy: 5 },
        { name: "Living", cx: 7.5, cy: 18 },
        { name: "Kitchen", cx: 20, cy: 18 },
        { name: "Bed", cx: 12.5, cy: 34 },
      ],
      details:
        "Size: 25 x 40 ft | Area: 1000 sqft | Rooms: 4 | Doors: 1 | Windows: 2",
    },
    {
      name: "Option 4",
      outerWidth: 25,
      outerHeight: 40,
      scale: 15,
      walls: [
        { x1: 0.5, y1: 6, x2: 25 - 0.5, y2: 6, type: "internal" },
        { x1: 0.5, y1: 22, x2: 25 - 0.5, y2: 22, type: "internal" },
        { x1: 15, y1: 6, x2: 15, y2: 22, type: "internal" },
      ],
      doors: [{ x: 11.5, y: 0, width: 2, orientation: "horizontal" }],
      windows: [
        { x: 2.5, y: 0, width: 4, orientation: "horizontal" },
        { x: 25 - 6.5, y: 0, width: 4, orientation: "horizontal" },
      ],
      rooms: [
        { name: "Foyer", cx: 7.5, cy: 3 },
        { name: "Living", cx: 7.5, cy: 14 },
        { name: "Dining", cx: 20, cy: 14 },
        { name: "Kitchen", cx: 7.5, cy: 28 },
        { name: "Bed", cx: 20, cy: 28 },
      ],
      details:
        "Size: 25 x 40 ft | Area: 1000 sqft | Rooms: 5 | Doors: 1 | Windows: 2",
    },
    {
      name: "Option 5",
      outerWidth: 25,
      outerHeight: 40,
      scale: 15,
      walls: [
        { x1: 0.5, y1: 12, x2: 25 - 0.5, y2: 12, type: "internal" },
        { x1: 0.5, y1: 28, x2: 25 - 0.5, y2: 28, type: "internal" },
        { x1: 15, y1: 12, x2: 15, y2: 28, type: "internal" },
      ],
      doors: [{ x: 11, y: 0, width: 3, orientation: "horizontal" }],
      windows: [
        { x: 2.5, y: 0, width: 4.5, orientation: "horizontal" },
        { x: 25 - 6.5, y: 0, width: 4.5, orientation: "horizontal" },
      ],
      rooms: [
        { name: "Entrance", cx: 12.5, cy: 5 },
        { name: "Living", cx: 7.5, cy: 20 },
        { name: "Bed", cx: 20, cy: 20 },
        { name: "Study", cx: 12.5, cy: 34 },
      ],
      details:
        "Size: 25 x 40 ft | Area: 1000 sqft | Rooms: 4 | Doors: 1 | Windows: 2",
    },
    {
      name: "Option 6",
      outerWidth: 25,
      outerHeight: 40,
      scale: 15,
      walls: [
        { x1: 0.5, y1: 10, x2: 25 - 0.5, y2: 10, type: "internal" },
        { x1: 0.5, y1: 26, x2: 25 - 0.5, y2: 26, type: "internal" },
        { x1: 15, y1: 10, x2: 15, y2: 26, type: "internal" },
      ],
      doors: [{ x: 11.5, y: 0, width: 2, orientation: "horizontal" }],
      windows: [
        { x: 3, y: 0, width: 4, orientation: "horizontal" },
        { x: 25 - 7, y: 0, width: 4, orientation: "horizontal" },
      ],
      rooms: [
        { name: "Lobby", cx: 12.5, cy: 5 },
        { name: "Living", cx: 7.5, cy: 18 },
        { name: "Dining", cx: 20, cy: 18 },
        { name: "Bed", cx: 12.5, cy: 34 },
      ],
      details:
        "Size: 25 x 40 ft | Area: 1000 sqft | Rooms: 4 | Doors: 1 | Windows: 2",
    },
    {
      name: "Option 7",
      outerWidth: 25,
      outerHeight: 40,
      scale: 15,
      walls: [
        { x1: 0.5, y1: 8, x2: 25 - 0.5, y2: 8, type: "internal" },
        { x1: 0.5, y1: 24, x2: 25 - 0.5, y2: 24, type: "internal" },
      ],
      doors: [{ x: 11, y: 0, width: 3, orientation: "horizontal" }],
      windows: [
        { x: 3, y: 0, width: 4, orientation: "horizontal" },
        { x: 25 - 7, y: 0, width: 4, orientation: "horizontal" },
      ],
      rooms: [
        { name: "Entry", cx: 12.5, cy: 4 },
        { name: "Living", cx: 7.5, cy: 16 },
        { name: "Dining", cx: 20, cy: 16 },
        { name: "Kitchen", cx: 7.5, cy: 32 },
        { name: "Bed", cx: 20, cy: 32 },
      ],
      details:
        "Size: 25 x 40 ft | Area: 1000 sqft | Rooms: 5 | Doors: 1 | Windows: 2",
    },
  ],
  "30x40": [
    {
      name: "Option 1",
      outerWidth: 30,
      outerHeight: 40,
      scale: 15,
      walls: [
        { x1: 0.5, y1: 6, x2: 30 - 0.5, y2: 6, type: "internal" },
        { x1: 0.5, y1: 22, x2: 30 - 0.5, y2: 22, type: "internal" },
        { x1: 0.5, y1: 32, x2: 30 - 0.5, y2: 32, type: "internal" },
        { x1: 16, y1: 6, x2: 16, y2: 22, type: "internal" },
        { x1: 10, y1: 22, x2: 10, y2: 32, type: "internal" },
      ],
      doors: [{ x: 14, y: 0, width: 2, orientation: "horizontal" }],
      windows: [
        { x: 2, y: 0, width: 4, orientation: "horizontal" },
        { x: 24, y: 0, width: 4, orientation: "horizontal" },
        { x: 0, y: 10, width: 0.5, orientation: "vertical", height: 4 },
        {
          x: 30 - 0.5,
          y: 10,
          width: 0.5,
          orientation: "vertical",
          height: 4,
        },
      ],
      rooms: [
        { name: "Foyer", cx: 8, cy: 3 },
        { name: "Living", cx: 8, cy: 14 },
        { name: "Dining", cx: 23, cy: 14 },
        { name: "Kitchen", cx: 5, cy: 27 },
        { name: "Hall", cx: 20, cy: 27 },
        { name: "Master", cx: 7.5, cy: 36 },
        { name: "Guest", cx: 22.5, cy: 36 },
      ],
      details:
        "Size: 30 x 40 ft | Area: 1200 sqft | Rooms: 7 | Doors: 1 | Windows: 4",
    },
    {
      name: "Option 2",
      outerWidth: 30,
      outerHeight: 40,
      scale: 15,
      walls: [
        { x1: 0.5, y1: 8, x2: 30 - 0.5, y2: 8, type: "internal" },
        { x1: 0.5, y1: 24, x2: 30 - 0.5, y2: 24, type: "internal" },
        { x1: 15, y1: 8, x2: 15, y2: 24, type: "internal" },
      ],
      doors: [{ x: 14, y: 0, width: 2, orientation: "horizontal" }],
      windows: [
        { x: 2, y: 0, width: 4, orientation: "horizontal" },
        { x: 24, y: 0, width: 4, orientation: "horizontal" },
        { x: 0, y: 10, width: 0.5, orientation: "vertical", height: 4 },
        {
          x: 30 - 0.5,
          y: 10,
          width: 0.5,
          orientation: "vertical",
          height: 4,
        },
      ],
      rooms: [
        { name: "Entry/Living", cx: 15, cy: 4 },
        { name: "Living", cx: 7.5, cy: 16 },
        { name: "Dining", cx: 22.5, cy: 16 },
        { name: "Kitchen", cx: 5, cy: 32 },
        { name: "Bed", cx: 20, cy: 32 },
      ],
      details:
        "Size: 30 x 40 ft | Area: 1200 sqft | Rooms: 5 | Doors: 1 | Windows: 4",
    },
    {
      name: "Option 3",
      outerWidth: 30,
      outerHeight: 40,
      scale: 15,
      walls: [
        { x1: 0.5, y1: 10, x2: 30 - 0.5, y2: 10, type: "internal" },
        { x1: 0.5, y1: 26, x2: 30 - 0.5, y2: 26, type: "internal" },
        { x1: 15, y1: 10, x2: 15, y2: 26, type: "internal" },
      ],
      doors: [{ x: 14, y: 0, width: 2, orientation: "horizontal" }],
      windows: [
        { x: 2.5, y: 0, width: 4, orientation: "horizontal" },
        { x: 30 - 6.5, y: 0, width: 4, orientation: "horizontal" },
        { x: 0, y: 12, width: 0.5, orientation: "vertical", height: 4 },
        {
          x: 30 - 0.5,
          y: 12,
          width: 0.5,
          orientation: "vertical",
          height: 4,
        },
      ],
      rooms: [
        { name: "Lobby", cx: 15, cy: 5 },
        { name: "Living", cx: 7.5, cy: 18 },
        { name: "Dining", cx: 22.5, cy: 18 },
        { name: "Kitchen", cx: 7.5, cy: 32 },
        { name: "Bed", cx: 22.5, cy: 32 },
      ],
      details:
        "Size: 30 x 40 ft | Area: 1200 sqft | Rooms: 5 | Doors: 1 | Windows: 4",
    },
    {
      name: "Option 4",
      outerWidth: 30,
      outerHeight: 40,
      scale: 15,
      walls: [
        { x1: 0.5, y1: 8, x2: 30 - 0.5, y2: 8, type: "internal" },
        { x1: 0.5, y1: 24, x2: 30 - 0.5, y2: 24, type: "internal" },
        { x1: 15, y1: 8, x2: 15, y2: 24, type: "internal" },
        { x1: 10, y1: 24, x2: 10, y2: 40 - 0.5, type: "internal" },
      ],
      doors: [{ x: 14, y: 0, width: 2, orientation: "horizontal" }],
      windows: [
        { x: 2, y: 0, width: 4, orientation: "horizontal" },
        { x: 24, y: 0, width: 4, orientation: "horizontal" },
        { x: 0, y: 14, width: 0.5, orientation: "vertical", height: 4 },
        {
          x: 30 - 0.5,
          y: 14,
          width: 0.5,
          orientation: "vertical",
          height: 4,
        },
      ],
      rooms: [
        { name: "Foyer", cx: 8, cy: 4 },
        { name: "Living", cx: 7.5, cy: 16 },
        { name: "Dining", cx: 22.5, cy: 16 },
        { name: "Kitchen", cx: 5, cy: 28 },
        { name: "Bed", cx: 20, cy: 28 },
      ],
      details:
        "Size: 30 x 40 ft | Area: 1200 sqft | Rooms: 5 | Doors: 1 | Windows: 4",
    },
    {
      name: "Option 5",
      outerWidth: 30,
      outerHeight: 40,
      scale: 15,
      walls: [
        { x1: 0.5, y1: 12, x2: 30 - 0.5, y2: 12, type: "internal" },
        { x1: 0.5, y1: 28, x2: 30 - 0.5, y2: 28, type: "internal" },
        { x1: 15, y1: 12, x2: 15, y2: 28, type: "internal" },
      ],
      doors: [{ x: 14, y: 0, width: 2, orientation: "horizontal" }],
      windows: [
        { x: 3, y: 0, width: 4, orientation: "horizontal" },
        { x: 30 - 7, y: 0, width: 4, orientation: "horizontal" },
        { x: 0, y: 16, width: 0.5, orientation: "vertical", height: 4 },
        {
          x: 30 - 0.5,
          y: 16,
          width: 0.5,
          orientation: "vertical",
          height: 4,
        },
      ],
      rooms: [
        { name: "Entry", cx: 15, cy: 5 },
        { name: "Living", cx: 7.5, cy: 18 },
        { name: "Dining", cx: 22.5, cy: 18 },
        { name: "Kitchen", cx: 7.5, cy: 32 },
        { name: "Bed", cx: 22.5, cy: 32 },
      ],
      details:
        "Size: 30 x 40 ft | Area: 1200 sqft | Rooms: 5 | Doors: 1 | Windows: 4",
    },
    {
      name: "Option 6",
      outerWidth: 30,
      outerHeight: 40,
      scale: 15,
      walls: [
        { x1: 0.5, y1: 10, x2: 30 - 0.5, y2: 10, type: "internal" },
        { x1: 0.5, y1: 26, x2: 30 - 0.5, y2: 26, type: "internal" },
        { x1: 15, y1: 10, x2: 15, y2: 26, type: "internal" },
      ],
      doors: [{ x: 14, y: 0, width: 2, orientation: "horizontal" }],
      windows: [
        { x: 2.5, y: 0, width: 4, orientation: "horizontal" },
        { x: 30 - 6.5, y: 0, width: 4, orientation: "horizontal" },
        { x: 0, y: 18, width: 0.5, orientation: "vertical", height: 4 },
        {
          x: 30 - 0.5,
          y: 18,
          width: 0.5,
          orientation: "vertical",
          height: 4,
        },
      ],
      rooms: [
        { name: "Lobby", cx: 15, cy: 5 },
        { name: "Living", cx: 7.5, cy: 18 },
        { name: "Dining", cx: 22.5, cy: 18 },
        { name: "Kitchen", cx: 7.5, cy: 32 },
        { name: "Bed", cx: 22.5, cy: 32 },
      ],
      details:
        "Size: 30 x 40 ft | Area: 1200 sqft | Rooms: 5 | Doors: 1 | Windows: 4",
    },
    {
      name: "Option 7",
      outerWidth: 30,
      outerHeight: 40,
      scale: 15,
      walls: [
        { x1: 0.5, y1: 8, x2: 30 - 0.5, y2: 8, type: "internal" },
        { x1: 0.5, y1: 24, x2: 30 - 0.5, y2: 24, type: "internal" },
      ],
      doors: [{ x: 14, y: 0, width: 2, orientation: "horizontal" }],
      windows: [
        { x: 3, y: 0, width: 4, orientation: "horizontal" },
        { x: 30 - 7, y: 0, width: 4, orientation: "horizontal" },
      ],
      rooms: [
        { name: "Entry", cx: 15, cy: 4 },
        { name: "Living", cx: 7.5, cy: 16 },
        { name: "Dining", cx: 22.5, cy: 16 },
        { name: "Kitchen", cx: 7.5, cy: 32 },
        { name: "Bed", cx: 22.5, cy: 32 },
      ],
      details:
        "Size: 30 x 40 ft | Area: 1200 sqft | Rooms: 5 | Doors: 1 | Windows: 4",
    },
  ],
  "60x80": [
    {
      name: "Option 1",
      outerWidth: 60,
      outerHeight: 80,
      scale: 10,
      walls: [
        { x1: 0.5, y1: 12, x2: 60 - 0.5, y2: 12, type: "internal" },
        { x1: 0.5, y1: 36, x2: 60 - 0.5, y2: 36, type: "internal" },
        { x1: 0.5, y1: 60, x2: 60 - 0.5, y2: 60, type: "internal" },
        { x1: 20, y1: 12, x2: 20, y2: 36, type: "internal" },
        { x1: 40, y1: 12, x2: 40, y2: 36, type: "internal" },
        { x1: 30, y1: 36, x2: 30, y2: 60, type: "internal" },
      ],
      doors: [{ x: 29, y: 0, width: 2, orientation: "horizontal" }],
      windows: [
        { x: 5, y: 0, width: 4, orientation: "horizontal" },
        { x: 60 - 9, y: 0, width: 4, orientation: "horizontal" },
        { x: 0, y: 20, width: 0.5, orientation: "vertical", height: 6 },
        {
          x: 60 - 0.5,
          y: 20,
          width: 0.5,
          orientation: "vertical",
          height: 6,
        },
      ],
      rooms: [
        { name: "Foyer", cx: 30, cy: 6 },
        { name: "Living", cx: 10, cy: 24 },
        { name: "Dining", cx: 30, cy: 24 },
        { name: "Family", cx: 50, cy: 24 },
        { name: "Kitchen", cx: 15, cy: 48 },
        { name: "Master", cx: 45, cy: 48 },
        { name: "Guest", cx: 30, cy: 70 },
      ],
      details:
        "Size: 60 x 80 ft | Area: 4800 sqft | Rooms: 7 | Doors: 1 | Windows: 4",
    },
    {
      name: "Option 2",
      outerWidth: 60,
      outerHeight: 80,
      scale: 10,
      walls: [
        { x1: 0.5, y1: 10, x2: 60 - 0.5, y2: 10, type: "internal" },
        { x1: 0.5, y1: 40, x2: 60 - 0.5, y2: 40, type: "internal" },
        { x1: 0.5, y1: 70, x2: 60 - 0.5, y2: 70, type: "internal" },
        { x1: 30, y1: 10, x2: 30, y2: 40, type: "internal" },
        { x1: 20, y1: 40, x2: 20, y2: 70, type: "internal" },
        { x1: 40, y1: 40, x2: 40, y2: 70, type: "internal" },
      ],
      doors: [{ x: 29, y: 0, width: 2, orientation: "horizontal" }],
      windows: [
        { x: 5, y: 0, width: 4, orientation: "horizontal" },
        { x: 60 - 9, y: 0, width: 4, orientation: "horizontal" },
        { x: 0, y: 20, width: 0.5, orientation: "vertical", height: 6 },
        {
          x: 60 - 0.5,
          y: 20,
          width: 0.5,
          orientation: "vertical",
          height: 6,
        },
      ],
      rooms: [
        { name: "Entry", cx: 30, cy: 5 },
        { name: "Living", cx: 15, cy: 25 },
        { name: "Dining", cx: 45, cy: 25 },
        { name: "Kitchen", cx: 15, cy: 55 },
        { name: "Family", cx: 45, cy: 55 },
        { name: "Guest", cx: 30, cy: 75 },
      ],
      details:
        "Size: 60 x 80 ft | Area: 4800 sqft | Rooms: 6 | Doors: 1 | Windows: 4",
    },
    {
      name: "Option 3",
      outerWidth: 60,
      outerHeight: 80,
      scale: 10,
      walls: [
        { x1: 0.5, y1: 12, x2: 60 - 0.5, y2: 12, type: "internal" },
        { x1: 0.5, y1: 36, x2: 60 - 0.5, y2: 36, type: "internal" },
        { x1: 0.5, y1: 60, x2: 60 - 0.5, y2: 60, type: "internal" },
      ],
      doors: [{ x: 29, y: 0, width: 2, orientation: "horizontal" }],
      windows: [
        { x: 5, y: 0, width: 4, orientation: "horizontal" },
        { x: 60 - 9, y: 0, width: 4, orientation: "horizontal" },
      ],
      rooms: [
        { name: "Foyer", cx: 30, cy: 6 },
        { name: "Living", cx: 15, cy: 20 },
        { name: "Dining", cx: 45, cy: 20 },
        { name: "Kitchen", cx: 15, cy: 40 },
        { name: "Master", cx: 45, cy: 40 },
        { name: "Guest", cx: 30, cy: 70 },
      ],
      details:
        "Size: 60 x 80 ft | Area: 4800 sqft | Rooms: 6 | Doors: 1 | Windows: 2",
    },
    {
      name: "Option 4",
      outerWidth: 60,
      outerHeight: 80,
      scale: 10,
      walls: [
        { x1: 0.5, y1: 14, x2: 60 - 0.5, y2: 14, type: "internal" },
        { x1: 0.5, y1: 44, x2: 60 - 0.5, y2: 44, type: "internal" },
      ],
      doors: [{ x: 29, y: 0, width: 2, orientation: "horizontal" }],
      windows: [
        { x: 5, y: 0, width: 4, orientation: "horizontal" },
        { x: 60 - 9, y: 0, width: 4, orientation: "horizontal" },
      ],
      rooms: [
        { name: "Entry", cx: 30, cy: 7 },
        { name: "Living", cx: 15, cy: 25 },
        { name: "Dining", cx: 45, cy: 25 },
        { name: "Kitchen", cx: 15, cy: 55 },
        { name: "Family", cx: 45, cy: 55 },
      ],
      details:
        "Size: 60 x 80 ft | Area: 4800 sqft | Rooms: 5 | Doors: 1 | Windows: 2",
    },
    {
      name: "Option 5",
      outerWidth: 60,
      outerHeight: 80,
      scale: 10,
      walls: [
        { x1: 0.5, y1: 10, x2: 60 - 0.5, y2: 10, type: "internal" },
        { x1: 0.5, y1: 50, x2: 60 - 0.5, y2: 50, type: "internal" },
      ],
      doors: [{ x: 29, y: 0, width: 2, orientation: "horizontal" }],
      windows: [
        { x: 5, y: 0, width: 4, orientation: "horizontal" },
        { x: 60 - 9, y: 0, width: 4, orientation: "horizontal" },
      ],
      rooms: [
        { name: "Foyer", cx: 30, cy: 6 },
        { name: "Living", cx: 15, cy: 22 },
        { name: "Dining", cx: 45, cy: 22 },
        { name: "Kitchen", cx: 15, cy: 38 },
        { name: "Master", cx: 45, cy: 38 },
        { name: "Guest", cx: 30, cy: 70 },
      ],
      details:
        "Size: 60 x 80 ft | Area: 4800 sqft | Rooms: 6 | Doors: 1 | Windows: 2",
    },
    {
      name: "Option 6",
      outerWidth: 60,
      outerHeight: 80,
      scale: 10,
      walls: [
        { x1: 0.5, y1: 12, x2: 60 - 0.5, y2: 12, type: "internal" },
        { x1: 0.5, y1: 36, x2: 60 - 0.5, y2: 36, type: "internal" },
        { x1: 0.5, y1: 60, x2: 60 - 0.5, y2: 60, type: "internal" },
        { x1: 30, y1: 12, x2: 30, y2: 36, type: "internal" },
      ],
      doors: [{ x: 29, y: 0, width: 2, orientation: "horizontal" }],
      windows: [
        { x: 5, y: 0, width: 4, orientation: "horizontal" },
        { x: 60 - 9, y: 0, width: 4, orientation: "horizontal" },
      ],
      rooms: [
        { name: "Foyer", cx: 30, cy: 6 },
        { name: "Living", cx: 15, cy: 22 },
        { name: "Dining", cx: 45, cy: 22 },
        { name: "Kitchen", cx: 15, cy: 40 },
        { name: "Master", cx: 45, cy: 40 },
        { name: "Guest", cx: 30, cy: 70 },
      ],
      details:
        "Size: 60 x 80 ft | Area: 4800 sqft | Rooms: 6 | Doors: 1 | Windows: 2",
    },
    {
      name: "Option 7",
      outerWidth: 60,
      outerHeight: 80,
      scale: 10,
      walls: [
        { x1: 0.5, y1: 14, x2: 60 - 0.5, y2: 14, type: "internal" },
        { x1: 0.5, y1: 44, x2: 60 - 0.5, y2: 44, type: "internal" },
      ],
      doors: [{ x: 29, y: 0, width: 2, orientation: "horizontal" }],
      windows: [
        { x: 5, y: 0, width: 4, orientation: "horizontal" },
        { x: 60 - 9, y: 0, width: 4, orientation: "horizontal" },
      ],
      rooms: [
        { name: "Entry", cx: 30, cy: 7 },
        { name: "Living", cx: 15, cy: 25 },
        { name: "Dining", cx: 45, cy: 25 },
        { name: "Kitchen", cx: 15, cy: 55 },
        { name: "Family", cx: 45, cy: 55 },
        { name: "Guest", cx: 30, cy: 75 },
      ],
      details:
        "Size: 60 x 80 ft | Area: 4800 sqft | Rooms: 6 | Doors: 1 | Windows: 2",
    },
  ],
};

// Global Variables
let currentSize = "";
let currentPlanIndex = null;
let currentPlan = null;
const sizeSelect = document.getElementById("sizeSelect");
const optionsBtn = document.getElementById("optionsBtn");
const downloadBtn = document.getElementById("downloadBtn");
const resetBtn = document.getElementById("resetBtn");
const planDetailsDiv = document.getElementById("planDetails");
const canvas = document.getElementById("planCanvas");
const ctx = canvas.getContext("2d");

// Function to draw a realistic door with a swing arc
function drawDoor(door, scale) {
  ctx.save();
  ctx.strokeStyle = "#d00";
  ctx.lineWidth = 3;
  // Draw the door edge
  if (door.orientation === "horizontal") {
    // Draw door line
    ctx.beginPath();
    ctx.moveTo(door.x * scale, door.y * scale);
    ctx.lineTo((door.x + door.width) * scale, door.y * scale);
    ctx.stroke();
    // Draw door swing arc (assume door is on top, swings inward from left hinge)
    const hingeX = door.x * scale;
    const hingeY = door.y * scale;
    const radius = door.width * scale;
    ctx.beginPath();
    ctx.setLineDash([4, 2]);
    ctx.arc(hingeX, hingeY, radius, 0, Math.PI / 2, false);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  // (Additional logic can be added for vertical doors)
  ctx.restore();
}

// Function to draw a window with realistic styling
function drawWindow(win, scale) {
  ctx.save();
  ctx.fillStyle = "#00f";
  ctx.strokeStyle = "#00008b";
  ctx.lineWidth = 1;
  if (win.orientation === "horizontal") {
    const winHeight = win.height ? win.height : 0.5;
    ctx.fillRect(
      win.x * scale,
      win.y * scale,
      win.width * scale,
      winHeight * scale
    );
    ctx.strokeRect(
      win.x * scale,
      win.y * scale,
      win.width * scale,
      winHeight * scale
    );
  } else {
    const winWidth = win.width ? win.width : 0.5;
    ctx.fillRect(
      win.x * scale,
      win.y * scale,
      winWidth * scale,
      (win.height || 4) * scale
    );
    ctx.strokeRect(
      win.x * scale,
      win.y * scale,
      winWidth * scale,
      (win.height || 4) * scale
    );
  }
  ctx.restore();
}

// Main function to draw the floor plan on canvas
function drawPlan(plan) {
  const scale = plan.scale;
  const wallThickness = 0.5 * scale; // assume wall thickness of 0.5 ft
  const margin = 20; // margin in pixels around the drawing

  // Calculate drawing size
  const drawWidth = plan.outerWidth * scale;
  const drawHeight = plan.outerHeight * scale;
  canvas.width = drawWidth + margin * 2;
  canvas.height = drawHeight + margin * 2;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(margin, margin);

  // Draw Outer Wall with fill (simulate wall thickness)
  ctx.fillStyle = "#d3d3d3";
  ctx.fillRect(0, 0, drawWidth, drawHeight);
  // Fill interior with white (offset by wall thickness)
  ctx.fillStyle = "#fff";
  ctx.fillRect(
    wallThickness,
    wallThickness,
    drawWidth - 2 * wallThickness,
    drawHeight - 2 * wallThickness
  );
  // Draw outer border
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, drawWidth, drawHeight);

  // Draw Internal Walls (dashed)
  ctx.strokeStyle = "#555";
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 4]);
  plan.walls.forEach((wall) => {
    ctx.beginPath();
    ctx.moveTo(wall.x1 * scale, wall.y1 * scale);
    ctx.lineTo(wall.x2 * scale, wall.y2 * scale);
    ctx.stroke();
  });
  ctx.setLineDash([]);

  // Draw Doors (with realistic swing arc)
  plan.doors.forEach((door) => {
    drawDoor(door, scale);
  });

  // Draw Windows
  plan.windows.forEach((win) => {
    drawWindow(win, scale);
  });

  // Draw Room Labels
  ctx.fillStyle = "#000";
  ctx.font = "bold 14px Arial";
  ctx.textAlign = "center";
  plan.rooms.forEach((room) => {
    ctx.fillText(room.name, room.cx * scale, room.cy * scale);
  });

  // Draw Plan Option Name at top center
  ctx.font = "bold 16px Arial";
  ctx.fillText(plan.name, drawWidth / 2, -5);

  ctx.restore();

  // Update Details Panel
  planDetailsDiv.textContent = plan.details;
}

// Function to select and display a random plan option for the chosen size
function displayRandomPlan() {
  if (currentSize && planData[currentSize]) {
    const planArray = planData[currentSize];
    let randomIndex = Math.floor(Math.random() * planArray.length);
    if (planArray.length > 1 && randomIndex === currentPlanIndex) {
      randomIndex = (randomIndex + 1) % planArray.length;
    }
    currentPlanIndex = randomIndex;
    currentPlan = planArray[randomIndex];
    drawPlan(currentPlan);
  }
}

// Event Listeners
sizeSelect.addEventListener("change", function () {
  currentSize = this.value;
  if (currentSize) {
    displayRandomPlan();
    optionsBtn.disabled = false;
    downloadBtn.disabled = false;
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    planDetailsDiv.textContent = "";
    optionsBtn.disabled = true;
    downloadBtn.disabled = true;
  }
});

optionsBtn.addEventListener("click", function () {
  if (currentSize) {
    displayRandomPlan();
  }
});

resetBtn.addEventListener("click", function () {
  sizeSelect.value = "";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  planDetailsDiv.textContent = "";
  currentSize = "";
  currentPlanIndex = null;
  currentPlan = null;
  optionsBtn.disabled = true;
  downloadBtn.disabled = true;
});

downloadBtn.addEventListener("click", function () {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "letter",
  });
  const imgData = canvas.toDataURL("image/png");
  const pdfWidth = doc.internal.pageSize.getWidth();
  const pdfHeight = doc.internal.pageSize.getHeight();
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;
  const x = (pdfWidth - imgWidth) / 2;
  const y = 40;
  doc.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(12);
  doc.text(currentPlan.details, pdfWidth / 2, y + imgHeight + 20, {
    align: "center",
  });
  doc.save("floor-plan.pdf");
});
