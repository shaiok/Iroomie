"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateDistance = void 0;
const calculateDistance = (coord1, coord2) => {
    if (!coord1 || !coord2)
        return null;
    return Math.abs(coord1[0] - coord2[0]) + Math.abs(coord1[1] - coord2[1]);
};
exports.calculateDistance = calculateDistance;
