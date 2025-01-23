/**
 * .eslint.js
 *
 * ESLint configuration file.
 */

import pluginVue from "eslint-plugin-vue";
import vueTsEslintConfig from "@vue/eslint-config-typescript";

export default [
    {
        name: "app/files-to-lint",
        files: ["**/*.{ts,mts,tsx,vue}"]
    },

    {
        name: "app/files-to-ignore",
        ignores: ["**/dist/**", "**/dist-ssr/**", "**/coverage/**"]
    },

    ...pluginVue.configs["flat/recommended"],
    ...vueTsEslintConfig(),

    {
        rules: {
            "@typescript-eslint/no-unused-expressions": [
                "error",
                {
                    allowShortCircuit: true,
                    allowTernary: true
                }
            ],
            "vue/multi-word-component-names": "off"
        }
    },

    {
        "vue/html-indent": [
            "error",
            type,
            {
                attribute: 1,
                baseIndent: 1,
                closeBracket: 0,
                alignAttributesVertically: true,
                ignores: []
            }
        ]
    }
];

