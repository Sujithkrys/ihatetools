function luminance(r, g, b) {
  var a = [r, g, b].map(function (v) {
      v /= 255;
      return v <= 0.03928
          ? v / 12.92
          : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function contrast(rgb1, rgb2) {
  var lum1 = luminance(rgb1[0], rgb1[1], rgb1[2]);
  var lum2 = luminance(rgb2[0], rgb2[1], rgb2[2]);
  var brightest = Math.max(lum1, lum2);
  var darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

// Light Mode
const lightBg = [250, 249, 247]; // --color-background
const lightTertiary = [105, 82, 196]; // --color-accent-tertiary
const lightContrast = contrast(lightBg, lightTertiary);
console.log('Light Mode Contrast (#6952C4 on #FAF9F7):', lightContrast.toFixed(2));

// Dark Mode
const darkBg = [12, 10, 8]; // --color-background
const darkTertiary = [155, 138, 230]; // --color-accent-tertiary
const darkContrast = contrast(darkBg, darkTertiary);
console.log('Dark Mode Contrast (#9B8AE6 on #0C0A08):', darkContrast.toFixed(2));

console.log('Requirement: WCAG AA requires 4.5:1 for normal text, 3:1 for large text/UI components.');
