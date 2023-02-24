module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'react-hooks'],
    parserOptions: {
        requireConfigFile: false,
        ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
        sourceType: 'module', // Allows for the use of imports
        ecmaFeatures: {
            jsx: true // Allows for the parsing of JSX
        }
    },
    extends: [
        'eslint:recommended',
        'eslint-config-airbnb-base',
        'eslint-config-airbnb-base/rules/strict',
        'eslint-config-airbnb/rules/react',
        'plugin:@typescript-eslint/recommended',
        'prettier',
        'prettier/@typescript-eslint'
    ],
    env: {
        browser: true,
        node: true,
        commonjs: true,
        es6: true,
        mocha: true,
        jest: true
    },
    settings: {
        react: {
            version: 'detect' // Tells eslint-plugin-react to automatically detect the version of React to use
        }
    },
    rules: {
        /**
         * eslint
         */
        'comma-dangle': [
            'error',
            {
                arrays: 'only-multiline',
                objects: 'only-multiline',
                imports: 'only-multiline',
                exports: 'only-multiline',
                functions: 'only-multiline'
            }
        ],
        indent: [
            'error',
            4,
            {
                SwitchCase: 1,
                VariableDeclarator: 1,
                outerIIFEBody: 1,
                // MemberExpression: null,
                FunctionDeclaration: {
                    parameters: 1,
                    body: 1
                },
                FunctionExpression: {
                    parameters: 1,
                    body: 1
                },
                CallExpression: {
                    arguments: 1
                },
                ArrayExpression: 1,
                ObjectExpression: 1,
                ImportDeclaration: 1,
                flatTernaryExpressions: false,
                // list derived from https://github.com/benjamn/ast-types/blob/HEAD/def/jsx.js
                ignoredNodes: [
                    'JSXElement',
                    'JSXElement > *',
                    'JSXAttribute',
                    'JSXIdentifier',
                    'JSXNamespacedName',
                    'JSXMemberExpression',
                    'JSXSpreadAttribute',
                    'JSXExpressionContainer',
                    'JSXOpeningElement',
                    'JSXClosingElement',
                    'JSXText',
                    'JSXEmptyExpression',
                    'JSXSpreadChild'
                ],
                ignoreComments: false
            }
        ],
        'import/first': 'off',
        'no-unused-vars': 'off',
        'no-underscore-dangle': 'off',
        'no-use-before-define': 'off',
        'no-undef': 'off',
        'no-useless-constructor': 'off',
        'no-useless-escape': 'off',
        'class-methods-use-this': 'off',
        'no-multiple-empty-lines': 'off',
        'global-require': 'off',
        'import/prefer-default-export': 'off',
        'no-bitwise': 'off',
        'no-mixed-operators': 'off',
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 'off',
        'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
        'no-continue': 'off',
        'one-var': 'off',
        'one-var-declaration-per-line': 'off',
        'no-restricted-syntax': [
            'error',
            {
                selector: 'LabeledStatement',
                message:
                    'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.'
            },
            {
                selector: 'WithStatement',
                message:
                    '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.'
            }
        ],
        'prefer-destructuring': 'off',
        'no-new': 'off',
        'no-script-url': 'off',
        'max-len': 'off',
        'no-unused-expressions': 'off',
        /**
         * eslint-plugin-import
         */
        'import/no-unresolved': 'off',
        'import/no-extraneous-dependencies': 'off',
        'import/extensions': 'off',
        /**
         * eslint-plugin-react
         */
        'react/jsx-indent': ['error', 4],
        'react/jsx-indent-props': ['error', 4],
        'react/jsx-closing-bracket-location': ['error', 'after-props'],
        'react/jsx-filename-extension': [
            'error',
            { extensions: ['.js', '.jsx', '.ts', '.tsx'] }
        ],
        'react/destructuring-assignment': 'off',
        'react/sort-comp': 'off',
        // https://github.com/yannickcr/eslint-plugin-react/issues/1846
        'react/button-has-type': 'off',
        'react/require-default-props': [
            'warn',
            {
                forbidDefaultForRequired: true
            }
        ],
        'react/prop-types': 'off',
        'react/jsx-props-no-spreading': 'off',
        'react/no-array-index-key': 'warn',
        'react-hooks/rules-of-hooks': 'error', // 检查 Hook 的规则
        'react-hooks/exhaustive-deps': 'warn', // 检查 effect 的依赖
        /**
         * typescript
         */
        '@typescript-eslint/semi': ['error', 'always'],
        '@typescript-eslint/indent': [
            'error',
            4,
            {
                SwitchCase: 1
            }
        ],
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-inferrable-types': 'off',
        '@typescript-eslint/no-use-before-define': ['error'],
        'no-param-reassign': 'warn',
        'no-shadow': 'warn',
        '@typescript-eslint/no-unused-vars': 'warn',
    }
};
