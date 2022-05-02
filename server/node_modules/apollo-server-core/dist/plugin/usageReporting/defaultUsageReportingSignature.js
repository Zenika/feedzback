"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultUsageReportingSignature = void 0;
const graphql_1 = require("graphql");
const lodash_sortby_1 = __importDefault(require("lodash.sortby"));
function defaultUsageReportingSignature(ast, operationName) {
    return printWithReducedWhitespace(sortAST(removeAliases(hideLiterals(dropUnusedDefinitions(ast, operationName)))));
}
exports.defaultUsageReportingSignature = defaultUsageReportingSignature;
function printWithReducedWhitespace(ast) {
    const sanitizedAST = (0, graphql_1.visit)(ast, {
        StringValue(node) {
            return {
                ...node,
                value: Buffer.from(node.value, 'utf8').toString('hex'),
                block: false,
            };
        },
    });
    const withWhitespace = (0, graphql_1.print)(sanitizedAST);
    const minimizedButStillHex = withWhitespace
        .replace(/\s+/g, ' ')
        .replace(/([^_a-zA-Z0-9]) /g, (_, c) => c)
        .replace(/ ([^_a-zA-Z0-9])/g, (_, c) => c);
    return minimizedButStillHex.replace(/"([a-f0-9]+)"/g, (_, hex) => JSON.stringify(Buffer.from(hex, 'hex').toString('utf8')));
}
function sortAST(ast) {
    return (0, graphql_1.visit)(ast, {
        Document(node) {
            return {
                ...node,
                definitions: (0, lodash_sortby_1.default)(node.definitions, 'kind', 'name.value'),
            };
        },
        OperationDefinition(node) {
            return {
                ...node,
                variableDefinitions: sorted(node.variableDefinitions, 'variable.name.value'),
            };
        },
        SelectionSet(node) {
            return {
                ...node,
                selections: (0, lodash_sortby_1.default)(node.selections, 'kind', 'name.value'),
            };
        },
        Field(node) {
            return {
                ...node,
                arguments: sorted(node.arguments, 'name.value'),
            };
        },
        FragmentSpread(node) {
            return { ...node, directives: sorted(node.directives, 'name.value') };
        },
        InlineFragment(node) {
            return { ...node, directives: sorted(node.directives, 'name.value') };
        },
        FragmentDefinition(node) {
            return {
                ...node,
                directives: sorted(node.directives, 'name.value'),
                variableDefinitions: sorted(node.variableDefinitions, 'variable.name.value'),
            };
        },
        Directive(node) {
            return { ...node, arguments: sorted(node.arguments, 'name.value') };
        },
    });
}
function sorted(items, ...iteratees) {
    if (items) {
        return (0, lodash_sortby_1.default)(items, ...iteratees);
    }
    return undefined;
}
function removeAliases(ast) {
    return (0, graphql_1.visit)(ast, {
        Field(node) {
            return {
                ...node,
                alias: undefined,
            };
        },
    });
}
function hideLiterals(ast) {
    return (0, graphql_1.visit)(ast, {
        IntValue(node) {
            return { ...node, value: '0' };
        },
        FloatValue(node) {
            return { ...node, value: '0' };
        },
        StringValue(node) {
            return { ...node, value: '', block: false };
        },
        ListValue(node) {
            return { ...node, values: [] };
        },
        ObjectValue(node) {
            return { ...node, fields: [] };
        },
    });
}
function dropUnusedDefinitions(ast, operationName) {
    const separated = (0, graphql_1.separateOperations)(ast)[operationName];
    if (!separated) {
        return ast;
    }
    return separated;
}
//# sourceMappingURL=defaultUsageReportingSignature.js.map