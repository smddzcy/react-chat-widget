module.exports = {
  "parser": "babel-eslint",
  "extends": [
    "airbnb"
  ],
  "rules": {
    "import/prefer-default-export": 0,
    "prefer-destructuring": [
      "error",
      {
        "object": true,
        "array": false
      }
    ],
    "comma-dangle": 0,
    "react/jsx-props-no-spreading": 0,
    "arrow-parens": ["error", "as-needed"],
    "class-methods-use-this": 0,
    "consistent-return": 0,
    "func-names": 0,
    "import/no-extraneous-dependencies": 0,
    "jsx-a11y/anchor-is-valid": 0,
    "jsx-a11y/no-autofocus": 0,
    "jsx-a11y/label-has-associated-control": 0,
    "no-shadow": "off",
    "no-unused-vars": [
      "error",
      {
        "varsIgnorePattern": "s"
      }
    ],
    "no-unused-expressions": [
      "error",
      {
        "allowShortCircuit": true,
        "allowTernary": true
      }
    ],
    "no-bitwise": 0,
    "no-nested-ternary": 0,
    "no-extend-native": 0,
    "no-continue": 0,
    "no-empty": 0,
    "no-use-before-define": 0,
    "no-case-declarations": 0,
    "global-require": 0,
    "no-confusing-arrow": 0,
    "no-return-assign": 0,
    "no-alert": 0,
    "require-yield": 0,
    "react/sort-comp": 0,
    "react/jsx-no-target-blank": 0,
    "react/require-default-props": 0,
    "react/jsx-filename-extension": 0,
    "react/jsx-one-expression-per-line": 0,
    "react/forbid-prop-types": 0,
    "react/no-array-index-key": 0,
    "react/no-did-update-set-state": 0,
    "react/no-multi-comp": 0,
    "no-throw-literal": 0,
    "no-empty": 0,
    "no-use-before-define": 0,
    "no-underscore-dangle": 0,
    "no-param-reassign": 0,
    "no-prototype-builtins": 0,
    "jsx-a11y/no-noninteractive-element-interactions": 0,
    "jsx-a11y/no-static-element-interactions": 0,
    "jsx-a11y/click-events-have-key-events": 0,
    "jsx-a11y/anchor-has-content": 0,
    "jsx-a11y/label-has-for": 0,
    "react/destructuring-assignment": 0,
    "react/prop-types": 0,
    "max-len": 0,
    "template-curly-spacing": "off",
    "indent": "off"
  },
  "globals": {
    "window": true,
    "localStorage": true,
    "document": true,
    "File": true,
    "Blob": true,
    "APP_ENV": true,
    "APP_PLATFORM": true,
    "IS_DEV_MODE": true,
    "BUILD_MOMENT": true,
    "NODE_ENV": true
  },
  "settings": {
    "import/resolver": {
      "node": {
        "moduleDirectory": [
          "node_modules",
          "src"
        ]
      }
    }
  }
}
