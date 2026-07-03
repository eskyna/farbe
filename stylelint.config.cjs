module.exports = {
  ignoreFiles: ['dist/**', 'node_modules/**'],
  rules: {
    'block-no-empty': true,
    'color-no-invalid-hex': true,
    'declaration-block-no-duplicate-properties': [true, { ignore: ['consecutive-duplicates-with-different-values'] }],
    'font-family-no-duplicate-names': true,
    'function-linear-gradient-no-nonstandard-direction': true,
    'no-duplicate-selectors': true,
    'property-no-unknown': [
      true,
      {
        ignoreProperties: ['-webkit-appearance', '-webkit-overflow-scrolling', '-webkit-tap-highlight-color']
      }
    ],
    'selector-pseudo-class-no-unknown': true,
    'selector-pseudo-element-no-unknown': true,
    'unit-no-unknown': true
  }
};

