export const calculateDistance = (
  coord1?: [number, number],
  coord2?: [number, number]
): number | null => {
  if (!coord1 || !coord2) return null;
  return Math.abs(coord1[0] - coord2[0]) + Math.abs(coord1[1] - coord2[1]);
};