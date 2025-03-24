// Utility: Returns a random integer between min and max (inclusive)
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Draws a horizontal dashed dimension line with arrowheads and centered text.
function drawHorizontalDimension(ctx, x, y, width, text, fontSize) {
  ctx.save();
  ctx.strokeStyle = "lightgray";
  ctx.lineWidth = 1;
  ctx.setLineDash([5, 5]); // Dashed line
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + width, y);
  ctx.stroke();

  // Draw left arrowhead
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + 5, y - 5);
  ctx.moveTo(x, y);
  ctx.lineTo(x + 5, y + 5);
  ctx.stroke();

  // Draw right arrowhead
  ctx.beginPath();
  ctx.moveTo(x + width, y);
  ctx.lineTo(x + width - 5, y - 5);
  ctx.moveTo(x + width, y);
  ctx.lineTo(x + width - 5, y + 5);
  ctx.stroke();

  ctx.setLineDash([]); // Reset dash

  ctx.font = fontSize + "px Arial";
  ctx.fillStyle = "gray";
  ctx.textAlign = "center";
  ctx.fillText(text, x + width / 2, y - 7);
  ctx.restore();
}

// Draws a vertical dashed dimension line with arrowheads and rotated text.
function drawVerticalDimension(ctx, x, y, height, text, fontSize) {
  ctx.save();
  ctx.strokeStyle = "lightgray";
  ctx.lineWidth = 1;
  ctx.setLineDash([5, 5]); // Dashed line
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y + height);
  ctx.stroke();

  // Draw top arrowhead
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x - 5, y + 5);
  ctx.moveTo(x, y);
  ctx.lineTo(x + 5, y + 5);
  ctx.stroke();

  // Draw bottom arrowhead
  ctx.beginPath();
  ctx.moveTo(x, y + height);
  ctx.lineTo(x - 5, y + height - 5);
  ctx.moveTo(x, y + height);
  ctx.lineTo(x + 5, y + height - 5);
  ctx.stroke();

  ctx.setLineDash([]); // Reset dash

  ctx.save();
  ctx.translate(x - 10, y + height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.font = fontSize + "px Arial";
  ctx.fillStyle = "gray";
  ctx.textAlign = "center";
  ctx.fillText(text, 0, -7);
  ctx.restore();
  ctx.restore();
}

// Draws a room with its rectangle, label, and dimension lines.
// offsetX and offsetY shift the drawing area.
function drawRoom(
  ctx,
  room,
  scale,
  offsetX,
  offsetY,
  roomLabelFontSize,
  dimensionFontSize
) {
  let px = offsetX + room.x * scale;
  let py = offsetY + room.y * scale;
  let pWidth = room.width * scale;
  let pHeight = room.height * scale;

  // Choose a fill color based on room type.
  let fillColor = "#ddd";
  switch (room.type) {
    case "Living Hall":
      fillColor = "#fff3c4";
      break;
    case "Bedroom":
      fillColor = "#c4e1ff";
      break;
    case "Kitchen":
      fillColor = "#c4ffc4";
      break;
    case "Bathroom":
      fillColor = "#ffc4c4";
      break;
    case "Utility":
      fillColor = "#e0e0e0";
      break;
  }

  ctx.fillStyle = fillColor;
  ctx.fillRect(px, py, pWidth, pHeight);
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.strokeRect(px, py, pWidth, pHeight);

  // Draw room label centered in the room.
  ctx.font = roomLabelFontSize + "px Arial";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(room.type, px + pWidth / 2, py + pHeight / 2);

  // Draw the room's dimension lines.
  drawHorizontalDimension(
    ctx,
    px,
    py - 10,
    pWidth,
    room.width + " ft",
    dimensionFontSize
  );
  drawVerticalDimension(
    ctx,
    px - 10,
    py,
    pHeight,
    room.height + " ft",
    dimensionFontSize
  );
}

// Checks if a room (in ft) can be further split.
function canSplit(room, minSize) {
  return room.width > 2 * minSize || room.height > 2 * minSize;
}

// Splits a room (vertically or horizontally) ensuring each new room is at least minSize ft.
function splitRoom(room, minSize) {
  let splitVertically;
  if (room.width > room.height && room.width >= 2 * minSize) {
    splitVertically = true;
  } else if (room.height >= 2 * minSize) {
    splitVertically = false;
  } else {
    return [room];
  }

  if (splitVertically) {
    let minX = room.x + minSize;
    let maxX = room.x + room.width - minSize;
    if (maxX <= minX) return [room];
    let splitX = randomInt(minX, maxX);
    let room1 = {
      x: room.x,
      y: room.y,
      width: splitX - room.x,
      height: room.height,
    };
    let room2 = {
      x: splitX,
      y: room.y,
      width: room.x + room.width - splitX,
      height: room.height,
    };
    return [room1, room2];
  } else {
    let minY = room.y + minSize;
    let maxY = room.y + room.height - minSize;
    if (maxY <= minY) return [room];
    let splitY = randomInt(minY, maxY);
    let room1 = {
      x: room.x,
      y: room.y,
      width: room.width,
      height: splitY - room.y,
    };
    let room2 = {
      x: room.x,
      y: splitY,
      width: room.width,
      height: room.y + room.height - splitY,
    };
    return [room1, room2];
  }
}

// Main function: Generates the floor plan.
function generateFloorPlan() {
  // Get user inputs (all dimensions in feet).
  const floorWidth = parseInt(document.getElementById("floorWidth").value);
  const floorHeight = parseInt(document.getElementById("floorHeight").value);
  const livingHallCount = parseInt(
    document.getElementById("livingHallCount").value
  );
  const bedroomCount = parseInt(document.getElementById("bedroomCount").value);
  const kitchenCount = parseInt(document.getElementById("kitchenCount").value);
  const bathroomCount = parseInt(
    document.getElementById("bathroomCount").value
  );

  const totalRooms =
    livingHallCount + bedroomCount + kitchenCount + bathroomCount;

  // Setup the canvas at a fixed resolution of 1200x900.
  const canvas = document.getElementById("floorCanvas");
  canvas.width = 1200;
  canvas.height = 900;
  const ctx = canvas.getContext("2d");

  // Clear the canvas.
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Reserve space at the top for overall dimension text.
  const overallReserved = 40;

  // Calculate scale and center the floor plan within the canvas.
  const availableWidth = canvas.width;
  const availableHeight = canvas.height - overallReserved;
  // Use a margin to keep the drawing from touching the canvas edges.
  const margin = 20;
  let scale = Math.min(
    (availableWidth - 2 * margin) / floorWidth,
    (availableHeight - 2 * margin) / floorHeight
  );

  // Calculate drawing dimensions.
  let drawingWidth = floorWidth * scale;
  let drawingHeight = floorHeight * scale;
  // Center the drawing horizontally and vertically within the available area.
  let offsetX = (canvas.width - drawingWidth) / 2;
  let offsetY = overallReserved + (availableHeight - drawingHeight) / 2;

  // Set medium font sizes based on the scale.
  const dimensionFontSize = Math.max(10, Math.round(scale * 1.2));
  const roomLabelFontSize = Math.max(12, Math.round(scale * 1.5));

  // Generate room partitions using a BSP-like approach.
  const minRoomSize = 8; // in feet
  let rooms = [{ x: 0, y: 0, width: floorWidth, height: floorHeight }];
  while (rooms.length < totalRooms) {
    let splittable = rooms.filter((r) => canSplit(r, minRoomSize));
    if (splittable.length === 0) break;
    let roomToSplit = splittable[randomInt(0, splittable.length - 1)];
    let index = rooms.indexOf(roomToSplit);
    let splitRooms = splitRoom(roomToSplit, minRoomSize);
    rooms.splice(index, 1, ...splitRooms);
  }

  if (rooms.length !== totalRooms) {
    alert(
      "Warning: The floor dimensions might be too small to split into " +
        totalRooms +
        " rooms with a minimum size of " +
        minRoomSize +
        " ft."
    );
  }

  // Sort rooms by area (largest first).
  rooms.sort((a, b) => b.width * b.height - a.width * a.height);

  // Prepare an array of room types.
  let roomTypes = [];
  for (let i = 0; i < livingHallCount; i++) roomTypes.push("Living Hall");
  for (let i = 0; i < bedroomCount; i++) roomTypes.push("Bedroom");
  for (let i = 0; i < kitchenCount; i++) roomTypes.push("Kitchen");
  for (let i = 0; i < bathroomCount; i++) roomTypes.push("Bathroom");

  // Assign room types to the generated rooms.
  for (let i = 0; i < roomTypes.length && i < rooms.length; i++) {
    rooms[i].type = roomTypes[i];
  }
  // For any extra rooms, assign a default type.
  for (let i = roomTypes.length; i < rooms.length; i++) {
    rooms[i].type = "Utility";
  }

  // Draw the overall floor boundary.
  ctx.strokeStyle = "red";
  ctx.lineWidth = 2;
  ctx.strokeRect(offsetX, offsetY, floorWidth * scale, floorHeight * scale);
  drawHorizontalDimension(
    ctx,
    offsetX,
    offsetY - 20,
    floorWidth * scale,
    floorWidth + " ft",
    dimensionFontSize
  );
  drawVerticalDimension(
    ctx,
    offsetX - 20,
    offsetY,
    floorHeight * scale,
    floorHeight + " ft",
    dimensionFontSize
  );

  // Draw overall dimension text at the top center.
  ctx.font = dimensionFontSize + "px Arial";
  ctx.fillStyle = "gray";
  ctx.textAlign = "center";
  const overallText =
    "Overall: " +
    floorWidth +
    " ft x " +
    floorHeight +
    " ft, Total Area: " +
    floorWidth * floorHeight +
    " sqft";
  ctx.fillText(overallText, canvas.width / 2, overallReserved / 2 + 10);

  // Draw each room.
  rooms.forEach((room) => {
    drawRoom(
      ctx,
      room,
      scale,
      offsetX,
      offsetY,
      roomLabelFontSize,
      dimensionFontSize
    );
  });
}
