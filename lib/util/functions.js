"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
3;
function capitalize(s) {
    if (typeof s !== 'string')
        return '';
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}
exports.capitalize = capitalize;
function capitalizeInalterate(s) {
    if (typeof s !== 'string')
        return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
}
exports.capitalizeInalterate = capitalizeInalterate;
//# sourceMappingURL=functions.js.map