interface Point { x: number; y: number; }
interface ScreenBounds { left: number; right: number; top: number; bottom: number; }
interface WedgeArea { polygon: Point[]; centroid: Point; availableWidth: number; availableHeight: number; }

export function findRayScreenIntersection(centerX: number, centerY: number, angleDeg: number, bounds: ScreenBounds): Point {
  const angleRad = (angleDeg * Math.PI) / 180; const dirX = Math.cos(angleRad); const dirY = Math.sin(angleRad);
  const intersections: { point: Point; t: number }[] = [];
  if (Math.abs(dirX) > 0.001) { let t = (bounds.right - centerX) / dirX; if (t > 0) { const y = centerY + t * dirY; if (y >= bounds.top && y <= bounds.bottom) intersections.push({ point: { x: bounds.right, y }, t }); } t = (bounds.left - centerX) / dirX; if (t > 0) { const y = centerY + t * dirY; if (y >= bounds.top && y <= bounds.bottom) intersections.push({ point: { x: bounds.left, y }, t }); } }
  if (Math.abs(dirY) > 0.001) { let t = (bounds.bottom - centerY) / dirY; if (t > 0) { const x = centerX + t * dirX; if (x >= bounds.left && x <= bounds.right) intersections.push({ point: { x, y: bounds.bottom }, t }); } t = (bounds.top - centerY) / dirY; if (t > 0) { const x = centerX + t * dirX; if (x >= bounds.left && x <= bounds.right) intersections.push({ point: { x, y: bounds.top }, t }); } }
  if (intersections.length === 0) return { x: centerX + dirX * 100, y: centerY + dirY * 100 };
  intersections.sort((a, b) => a.t - b.t); return intersections[0].point;
}

function getEdgePointsBetween(start: Point, end: Point, bounds: ScreenBounds): Point[] {
  const corners: Point[] = [{ x: bounds.right, y: bounds.top }, { x: bounds.right, y: bounds.bottom }, { x: bounds.left, y: bounds.bottom }, { x: bounds.left, y: bounds.top }];
  const getEdgeIndex = (p: Point): number => { const eps = 1; if (Math.abs(p.x - bounds.right) < eps) return 0; if (Math.abs(p.y - bounds.bottom) < eps) return 1; if (Math.abs(p.x - bounds.left) < eps) return 2; if (Math.abs(p.y - bounds.top) < eps) return 3; return 0; };
  const startEdge = getEdgeIndex(start); const endEdge = getEdgeIndex(end); const points: Point[] = [];
  let currentEdge = startEdge; while (currentEdge !== endEdge) { points.push(corners[currentEdge]); currentEdge = (currentEdge + 1) % 4; }
  return points;
}

export function calculateWedgeArea(centerX: number, centerY: number, startAngleDeg: number, endAngleDeg: number, menuRadius: number, bounds: ScreenBounds): WedgeArea {
  const startIntersection = findRayScreenIntersection(centerX, centerY, startAngleDeg, bounds);
  const endIntersection = findRayScreenIntersection(centerX, centerY, endAngleDeg, bounds);
  const menuArcPoints: Point[] = []; const numArcPoints = 8;
  for (let i = 0; i <= numArcPoints; i++) { const angle = startAngleDeg + (endAngleDeg - startAngleDeg) * (i / numArcPoints); const rad = (angle * Math.PI) / 180; menuArcPoints.push({ x: centerX + Math.cos(rad) * menuRadius, y: centerY + Math.sin(rad) * menuRadius }); }
  const polygon: Point[] = [...menuArcPoints, startIntersection, ...getEdgePointsBetween(startIntersection, endIntersection, bounds), endIntersection];
  const midAngle = (startAngleDeg + endAngleDeg) / 2; const midRad = (midAngle * Math.PI) / 180;
  const midScreenPoint = findRayScreenIntersection(centerX, centerY, midAngle, bounds);
  const distToScreen = Math.sqrt(Math.pow(midScreenPoint.x - centerX, 2) + Math.pow(midScreenPoint.y - centerY, 2));
  const optimalDistance = menuRadius + (distToScreen - menuRadius) * 0.65;
  const centroid: Point = { x: centerX + Math.cos(midRad) * optimalDistance, y: centerY + Math.sin(midRad) * optimalDistance };
  const startEdgeRad = (startAngleDeg * Math.PI) / 180; const endEdgeRad = (endAngleDeg * Math.PI) / 180;
  const startEdgeAtContent: Point = { x: centerX + Math.cos(startEdgeRad) * optimalDistance, y: centerY + Math.sin(startEdgeRad) * optimalDistance };
  const endEdgeAtContent: Point = { x: centerX + Math.cos(endEdgeRad) * optimalDistance, y: centerY + Math.sin(endEdgeRad) * optimalDistance };
  const wedgeWidthAtContent = Math.sqrt(Math.pow(endEdgeAtContent.x - startEdgeAtContent.x, 2) + Math.pow(endEdgeAtContent.y - startEdgeAtContent.y, 2));
  const remainingToScreen = distToScreen - optimalDistance; const remainingFromMenu = optimalDistance - menuRadius; const availableDepth = Math.min(remainingToScreen, remainingFromMenu) * 1.5;
  const distToLeft = centroid.x - bounds.left; const distToRight = bounds.right - centroid.x; const distToTop = centroid.y - bounds.top; const distToBottom = bounds.bottom - centroid.y;
  const safeWedgeWidth = wedgeWidthAtContent * 0.7;
  return { polygon, centroid, availableWidth: Math.max(100, Math.min(safeWedgeWidth, distToLeft * 2, distToRight * 2, 280)), availableHeight: Math.max(80, Math.min(availableDepth, distToTop * 2, distToBottom * 2, 200)) };
}

export function calculateContentPlacement(centerX: number, centerY: number, startAngleDeg: number, endAngleDeg: number, menuRadius: number, screenWidth: number, screenHeight: number, edgePadding: number = 24) {
  const bounds: ScreenBounds = { left: edgePadding, right: screenWidth - edgePadding, top: edgePadding, bottom: screenHeight - edgePadding };
  const wedgeArea = calculateWedgeArea(centerX, centerY, startAngleDeg, endAngleDeg, menuRadius + 40, bounds);
  const midAngle = (startAngleDeg + endAngleDeg) / 2; const normalizedAngle = ((midAngle % 360) + 360) % 360;
  const textAlign: 'left' | 'right' | 'center' = normalizedAngle > 90 && normalizedAngle < 270 ? 'left' : 'right';
  const halfWidth = wedgeArea.availableWidth / 2; const halfHeight = wedgeArea.availableHeight / 2;
  return { x: Math.max(bounds.left + halfWidth, Math.min(bounds.right - halfWidth, wedgeArea.centroid.x)) - centerX, y: Math.max(bounds.top + halfHeight, Math.min(bounds.bottom - halfHeight, wedgeArea.centroid.y)) - centerY, width: wedgeArea.availableWidth, height: wedgeArea.availableHeight, textAlign };
}
