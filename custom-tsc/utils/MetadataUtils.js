"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRtExtensionMetadata = exports.pruneMetadata = exports.pruneCompilerMetadata = exports.updateCompilerClassMetadata = exports.updateCompilerPropsMetadata = exports.walkTypeNodeMembers = exports.walkTypeMembers = exports.isMappedType = exports.constructMappedTypeName = exports.isAliasToMappedType = exports.isPropsMappedType = exports.getMappedTypesInfo = exports.getIntersectionTypeNodeInfo = exports.getPropsInfo = exports.addMetadataToClassNode = exports.getDtMetadata = exports.getTypeParametersFromType = exports.getGenericTypeParameters = exports.stringToJS = exports.writebackCallbackToProperty = exports.tagNameToElementInterfaceName = void 0;
const ts = __importStar(require("typescript"));
const DecoratorUtils = __importStar(require("./DecoratorUtils"));
const TypeUtils = __importStar(require("./MetadataTypeUtils"));
const vm = __importStar(require("vm"));
function tagNameToElementInterfaceName(tagName) {
    return (tagName
        .toLowerCase()
        .match(/-(?<match>.*)/)[0]
        .replace(/-(.)/g, (match, group1) => group1.toUpperCase()) + "Element");
}
exports.tagNameToElementInterfaceName = tagNameToElementInterfaceName;
function writebackCallbackToProperty(property) {
    if (/^on[A-Z].*Changed$/.test(property)) {
        return (property[2].toLowerCase() + property.substring(3, property.length - 7));
    }
    return null;
}
exports.writebackCallbackToProperty = writebackCallbackToProperty;
function stringToJS(memberName, type, value, metaUtilObj) {
    try {
        switch (type) {
            case ts.SyntaxKind.NullKeyword:
            case ts.SyntaxKind.NumericLiteral:
            case ts.SyntaxKind.TrueKeyword:
            case ts.SyntaxKind.FalseKeyword:
                return JSON.parse(value);
            case ts.SyntaxKind.StringLiteral:
            case ts.SyntaxKind.ObjectLiteralExpression:
            case ts.SyntaxKind.ArrayLiteralExpression:
            case ts.SyntaxKind.AsExpression:
                return _execBundle(value);
            default:
                return undefined;
        }
    }
    catch (ex) {
        console.log(`${metaUtilObj.componentClassName}: Unable to convert the default value '${value}' to JSON for property '${memberName}'.`);
        return undefined;
    }
}
exports.stringToJS = stringToJS;
function getGenericTypeParameters(propsType) {
    let genericSignature = "<";
    for (let i = 0; i < propsType.typeArguments.length; i++) {
        const type = propsType.typeArguments[i];
        const typeName = type.getText();
        genericSignature += typeName;
        if (type.typeArguments && type.typeArguments.length) {
            genericSignature += getGenericTypeParameters(type);
        }
        if (i < propsType.typeArguments.length - 1) {
            genericSignature += ", ";
        }
    }
    genericSignature += ">";
    return genericSignature;
}
exports.getGenericTypeParameters = getGenericTypeParameters;
function getTypeParametersFromType(type, checker) {
    let typeParamsSignature;
    let typeArgs;
    if (type.aliasSymbol) {
        typeArgs = type.aliasTypeArguments;
    }
    else {
        typeArgs = checker.getTypeArguments(type);
    }
    if (Array.isArray(typeArgs) && typeArgs.length) {
        typeParamsSignature = "<";
        for (let i = 0; i < typeArgs.length; i++) {
            const typeArg = typeArgs[i];
            const typeArgName = TypeUtils.getTypeNameFromType(typeArg);
            typeParamsSignature += typeArgName;
            if (typeArg.typeArguments && typeArg.typeArguments.length) {
                typeParamsSignature += getTypeParametersFromType(typeArg, checker);
            }
            if (i < typeArgs.length - 1) {
                typeParamsSignature += ", ";
            }
        }
        typeParamsSignature += ">";
    }
    return typeParamsSignature;
}
exports.getTypeParametersFromType = getTypeParametersFromType;
const _METADATA_TAG = "ojmetadata";
const _METADATA_ARRAYS = [
    "implements",
    "preferredContent",
    "propertyLayout",
    "status",
    "styleClasses",
    "styleVariables",
];
function getDtMetadata(objWithJsDoc, metaUtilObj) {
    let dt = {};
    let tags = ts.getJSDocTags(objWithJsDoc);
    tags.forEach((tag) => {
        if (!ts.isJSDocDeprecatedTag(tag) &&
            tag.tagName.getText() === _METADATA_TAG) {
            let [mdKey, mdVal] = _getDtMetadataNameValue(tag, metaUtilObj);
            let isClassMetadata = ts.isClassDeclaration(objWithJsDoc);
            if (mdKey === "styleVariableSet") {
                if (mdVal.styleVariables && Array.isArray(mdVal.styleVariables)) {
                    mdKey = "styleVariables";
                    mdVal = mdVal.styleVariables.slice();
                }
                else {
                    console.log(`${metaUtilObj.componentClassName}: Invalid 'styleVariableSet' DT metadata specified: ${mdVal}`);
                }
            }
            if ((isClassMetadata && ["version", "jetVersion"].indexOf(mdKey) > -1) ||
                !dt[mdKey]) {
                if (_METADATA_ARRAYS.indexOf(mdKey) > -1 && !Array.isArray(mdVal)) {
                    mdVal = [mdVal];
                }
                if (mdKey === "styleClasses") {
                    let styleClasses = mdVal;
                    styleClasses.forEach((sc) => {
                        if (sc.extension) {
                            delete sc.extension["jet"];
                            if (Object.getOwnPropertyNames(sc.extension).length == 0) {
                                delete sc.extension;
                            }
                        }
                    });
                }
                dt[mdKey] = mdVal;
            }
            else {
                if (!Array.isArray(dt[mdKey])) {
                    dt[mdKey] = [dt[mdKey]];
                }
                if (!Array.isArray(mdVal)) {
                    dt[mdKey].push(mdVal);
                }
                else {
                    dt[mdKey] = dt[mdKey].concat(mdVal);
                }
            }
        }
    });
    return dt;
}
exports.getDtMetadata = getDtMetadata;
function addMetadataToClassNode(classNode, metadata) {
    if (Object.keys(metadata).length === 0) {
        return classNode;
    }
    const metadataNode = _metadataToAstNodes(metadata);
    const metadataProperty = ts.factory.createPropertyDeclaration(undefined, ts.factory.createModifiersFromModifierFlags(ts.ModifierFlags.Static), "metadata", undefined, undefined, metadataNode);
    const members = classNode.members.concat([metadataProperty]);
    return ts.factory.updateClassDeclaration(classNode, classNode.decorators, classNode.modifiers, classNode.name, classNode.typeParameters, classNode.heritageClauses, members);
}
exports.addMetadataToClassNode = addMetadataToClassNode;
function getPropsInfo(typeRef, vexportToAlias, checker) {
    var _a, _b, _c;
    let rtnInfo = null;
    let rtnObservedGlobalProps = [];
    let rtnMappedTypes = [];
    let rtnTypeNode;
    let rtnEGPRef = null;
    let isAliasToEGP = false;
    let propsTypeParamsNode;
    let propsTypeSubstituteName;
    let typeRefName = TypeUtils.getTypeNameFromTypeReference(typeRef);
    if (typeRefName === vexportToAlias.ExtendGlobalProps) {
        rtnEGPRef = typeRef;
        rtnTypeNode = (_a = typeRef.typeArguments) === null || _a === void 0 ? void 0 : _a[0];
        propsTypeParamsNode = rtnTypeNode;
    }
    else {
        isAliasToEGP = true;
        propsTypeParamsNode = typeRef;
        propsTypeSubstituteName = typeRefName;
        const typeRefType = checker.getTypeAtLocation(typeRef);
        if (typeRefType.aliasSymbol) {
            const aliasSymbolDeclaration = typeRefType.aliasSymbol.declarations[0];
            if (ts.isTypeAliasDeclaration(aliasSymbolDeclaration)) {
                const aliasType = aliasSymbolDeclaration.type;
                if (ts.isTypeReferenceNode(aliasType) &&
                    TypeUtils.getTypeNameFromTypeReference(aliasType) ===
                        vexportToAlias.ExtendGlobalProps) {
                    rtnEGPRef = aliasType;
                    rtnTypeNode = (_b = aliasType.typeArguments) === null || _b === void 0 ? void 0 : _b[0];
                }
            }
        }
        else {
            const symbolDeclaration = (_c = typeRefType.symbol) === null || _c === void 0 ? void 0 : _c.declarations[0];
            if (ts.isInterfaceDeclaration(symbolDeclaration) ||
                ts.isClassDeclaration(symbolDeclaration)) {
                const heritageClauses = symbolDeclaration.heritageClauses;
                if (heritageClauses) {
                    for (let clause of heritageClauses) {
                        if (rtnTypeNode) {
                            break;
                        }
                        for (let type of clause.types) {
                            if (TypeUtils.getTypeNameFromTypeReference(type) ===
                                vexportToAlias.ExtendGlobalProps) {
                                rtnEGPRef = type;
                                rtnTypeNode = type.typeArguments[0];
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
    if (rtnTypeNode) {
        let intersectionInlinePropsInfo;
        let rtnIsInlineIntersectionType = false;
        let rtnIsObservedGlobalPropsOnly = false;
        let mappedTypeGenericsDeclaration;
        if (ts.isIntersectionTypeNode(rtnTypeNode)) {
            intersectionInlinePropsInfo = getIntersectionTypeNodeInfo(rtnTypeNode, vexportToAlias, true, checker);
            if (intersectionInlinePropsInfo.substituteTypeNode) {
                rtnTypeNode = intersectionInlinePropsInfo.substituteTypeNode;
            }
            else {
                rtnIsInlineIntersectionType = true;
            }
            if (intersectionInlinePropsInfo.observedProps) {
                rtnObservedGlobalProps = rtnObservedGlobalProps.concat(intersectionInlinePropsInfo.observedProps);
            }
        }
        const rtnType = checker.getTypeAtLocation(rtnTypeNode);
        if (rtnType) {
            const mappedTypesInfo = getMappedTypesInfo(rtnType, checker, true, rtnTypeNode);
            if (mappedTypesInfo) {
                rtnMappedTypes = mappedTypesInfo.mappedTypes;
                rtnTypeNode = mappedTypesInfo.wrappedTypeNode;
                if (!isAliasToEGP) {
                    propsTypeParamsNode = rtnTypeNode;
                }
                mappedTypeGenericsDeclaration = TypeUtils.getNodeDeclaration(rtnTypeNode, checker);
            }
            else if (isAliasToMappedType(rtnType, rtnTypeNode)) {
                const scopedTypeAliases = checker.getSymbolsInScope(rtnTypeNode, ts.SymbolFlags.TypeAlias);
                const aliasMappedTypeName = TypeUtils.getTypeNameFromTypeReference(rtnTypeNode);
                const aliasToMappedType = scopedTypeAliases.find((sym) => {
                    return sym.getName() === aliasMappedTypeName;
                });
                if (aliasToMappedType) {
                    mappedTypeGenericsDeclaration = aliasToMappedType.getDeclarations()[0];
                }
            }
            let rtnIsInlineTypeLiteral = ts.isTypeLiteralNode(rtnTypeNode);
            let rtnPropsName;
            if (rtnIsInlineIntersectionType) {
                rtnPropsName = intersectionInlinePropsInfo.propsName;
            }
            else if (rtnIsInlineTypeLiteral) {
                rtnPropsName = propsTypeSubstituteName;
            }
            else {
                rtnPropsName = TypeUtils.getTypeNameFromTypeReference(rtnTypeNode);
                if (rtnPropsName === vexportToAlias.ObservedGlobalProps) {
                    rtnIsObservedGlobalPropsOnly = true;
                    rtnObservedGlobalProps = rtnObservedGlobalProps.concat(_getObservedGlobalPropsArray(rtnTypeNode));
                }
                else {
                    const rtnTypeDeclaration = TypeUtils.getTypeDeclaration(rtnType);
                    if (ts.isTypeAliasDeclaration(rtnTypeDeclaration)) {
                        const aliasTypeNode = rtnTypeDeclaration.type;
                        if (ts.isIntersectionTypeNode(aliasTypeNode)) {
                            const aliasIntersectionTypeNodeInfo = getIntersectionTypeNodeInfo(aliasTypeNode, vexportToAlias, false, checker);
                            if (aliasIntersectionTypeNodeInfo.observedProps) {
                                rtnObservedGlobalProps = rtnObservedGlobalProps.concat(aliasIntersectionTypeNodeInfo.observedProps);
                            }
                        }
                        else if (ts.isTypeReferenceNode(aliasTypeNode) &&
                            TypeUtils.getTypeNameFromTypeReference(aliasTypeNode) ===
                                vexportToAlias.ObservedGlobalProps) {
                            rtnIsObservedGlobalPropsOnly = true;
                            rtnObservedGlobalProps = rtnObservedGlobalProps.concat(_getObservedGlobalPropsArray(aliasTypeNode));
                        }
                    }
                }
            }
            rtnInfo = {
                propsType: rtnType,
                propsName: rtnPropsName,
                propsMappedTypes: rtnMappedTypes,
                propsExtendGlobalPropsRef: rtnEGPRef,
            };
            if (!(rtnIsInlineIntersectionType || rtnIsObservedGlobalPropsOnly)) {
                if (mappedTypeGenericsDeclaration) {
                    rtnInfo.propsGenericsDeclaration = mappedTypeGenericsDeclaration;
                }
                else {
                    rtnInfo.propsGenericsDeclaration = !rtnIsInlineTypeLiteral
                        ? TypeUtils.getTypeDeclaration(rtnType)
                        : TypeUtils.getNodeDeclaration(propsTypeParamsNode, checker);
                }
                if (propsTypeParamsNode.typeArguments) {
                    rtnInfo.propsTypeParams = getGenericTypeParameters(propsTypeParamsNode);
                }
            }
            if (rtnObservedGlobalProps.length > 0) {
                rtnInfo.propsObservedGlobalProps = rtnObservedGlobalProps;
            }
        }
    }
    return rtnInfo;
}
exports.getPropsInfo = getPropsInfo;
function getIntersectionTypeNodeInfo(intersectionTypeNode, vexportToAlias, isInline, checker) {
    let rtnInfo = {};
    let filteredTypeNodes = [];
    let observedProps = [];
    const typeNodes = intersectionTypeNode.types;
    for (let node of typeNodes) {
        if (ts.isTypeReferenceNode(node) &&
            TypeUtils.getTypeNameFromTypeReference(node) ===
                vexportToAlias.ObservedGlobalProps) {
            observedProps = observedProps.concat(_getObservedGlobalPropsArray(node));
            continue;
        }
        if (isInline) {
            filteredTypeNodes.push(node);
        }
    }
    if (filteredTypeNodes.length > 0) {
        if (filteredTypeNodes.length == 1) {
            rtnInfo.substituteTypeNode = filteredTypeNodes[0];
        }
        else {
            const types = filteredTypeNodes.map((node) => checker.getTypeAtLocation(node));
            if (types.length) {
                rtnInfo.propsName = TypeUtils.getTypeNameFromIntersectionTypes(types);
            }
        }
    }
    if (observedProps.length > 0) {
        rtnInfo.observedProps = observedProps;
    }
    return rtnInfo;
}
exports.getIntersectionTypeNodeInfo = getIntersectionTypeNodeInfo;
const _MAPPED_TYPENAMES = new Set([
    "Partial",
    "Required",
    "Readonly",
    "Pick",
    "Omit",
]);
function getMappedTypesInfo(outerType, checker, isPropsInfo, outerTypeNode) {
    var _a;
    let rtnInfo = null;
    let mappedTypes = [];
    let wrappedType = outerType;
    let wrappedTypeNode = outerTypeNode;
    while (wrappedType && isPropsInfo
        ? isPropsMappedType(wrappedType, wrappedTypeNode)
        : isMappedType(wrappedType)) {
        const mappedTypeName = TypeUtils.getTypeNameFromType(wrappedType);
        const mappedTypeArgs = wrappedType.aliasTypeArguments;
        if (mappedTypeName && mappedTypeArgs) {
            let params = mappedTypeArgs
                .slice(1)
                .map((t) => checker.typeToString(t))
                .join(", ");
            const mappedEntry = {
                name: mappedTypeName,
            };
            if (params !== "") {
                mappedEntry.params = params;
            }
            mappedTypes.push(mappedEntry);
            if (wrappedTypeNode) {
                wrappedTypeNode = (_a = wrappedTypeNode
                    .typeArguments) === null || _a === void 0 ? void 0 : _a[0];
                wrappedType = wrappedTypeNode
                    ? checker.getTypeAtLocation(wrappedTypeNode)
                    : null;
            }
            else {
                wrappedType = mappedTypeArgs[0];
            }
        }
        else {
            break;
        }
    }
    if (mappedTypes.length > 0 && wrappedType) {
        rtnInfo = {
            mappedTypes,
            wrappedTypeName: TypeUtils.getTypeNameFromType(wrappedType),
        };
        if (wrappedTypeNode) {
            rtnInfo.wrappedTypeNode = wrappedTypeNode;
        }
    }
    return rtnInfo;
}
exports.getMappedTypesInfo = getMappedTypesInfo;
function isPropsMappedType(type, typeNode) {
    return (isMappedType(type) &&
        _MAPPED_TYPENAMES.has(typeNode
            ? TypeUtils.getTypeNameFromTypeReference(typeNode)
            : TypeUtils.getTypeNameFromType(type)));
}
exports.isPropsMappedType = isPropsMappedType;
function isAliasToMappedType(type, typeNode) {
    return (isMappedType(type) &&
        !_MAPPED_TYPENAMES.has(TypeUtils.getTypeNameFromTypeReference(typeNode)));
}
exports.isAliasToMappedType = isAliasToMappedType;
function constructMappedTypeName(mappedTypesInfo, wrappedTypeGenerics) {
    let rtnName = "";
    let paramsStack = [];
    let poppedParams;
    const mappedTypesLast = mappedTypesInfo.mappedTypes.length - 1;
    mappedTypesInfo.mappedTypes.forEach((mType, i) => {
        rtnName += mType.name;
        if (mType.params) {
            paramsStack.push(mType.params);
        }
        else {
            paramsStack.push(null);
        }
        rtnName += "<";
        if (i === mappedTypesLast) {
            rtnName += mappedTypesInfo.wrappedTypeName;
            if (wrappedTypeGenerics) {
                rtnName += wrappedTypeGenerics;
            }
            while (paramsStack.length > 0) {
                if ((poppedParams = paramsStack.pop())) {
                    rtnName += `, ${poppedParams}>`;
                }
                else {
                    rtnName += ">";
                }
            }
        }
    });
    return rtnName;
}
exports.constructMappedTypeName = constructMappedTypeName;
function isMappedType(type) {
    var _a;
    let decl = (_a = type.symbol) === null || _a === void 0 ? void 0 : _a.declarations[0];
    return decl && ts.isMappedTypeNode(decl);
}
exports.isMappedType = isMappedType;
function walkTypeMembers(type, metaUtilObj, callback) {
    const isExcludedType = function (type, metaUtilObj) {
        var _a, _b, _c, _d;
        let rtnValue = false;
        const tname = (_a = type.aliasSymbol) === null || _a === void 0 ? void 0 : _a.name;
        if (tname && ((_b = metaUtilObj.excludedTypes) === null || _b === void 0 ? void 0 : _b.has(tname))) {
            rtnValue = true;
        }
        else {
            const decl = (_c = type.aliasSymbol) === null || _c === void 0 ? void 0 : _c.declarations[0];
            if (decl &&
                ts.isTypeAliasDeclaration(decl) &&
                ts.isTypeReferenceNode(decl.type) &&
                ((_d = metaUtilObj.excludedTypeAliases) === null || _d === void 0 ? void 0 : _d.has(TypeUtils.getTypeNameFromTypeReference(decl.type)))) {
                rtnValue = true;
            }
        }
        return rtnValue;
    };
    const getConstituentTypes = function (type, metaUtilObj, typeMap) {
        const checker = metaUtilObj.typeChecker;
        if (type.isIntersection()) {
            const intersectionTypes = type.types;
            for (let t of intersectionTypes) {
                getConstituentTypes(t, metaUtilObj, typeMap);
            }
        }
        else {
            const typeDecl = TypeUtils.getTypeDeclaration(type);
            if (typeDecl) {
                if (ts.isClassLike(typeDecl) || ts.isInterfaceDeclaration(typeDecl)) {
                    const heritageClauses = typeDecl.heritageClauses;
                    if (heritageClauses) {
                        for (let clause of heritageClauses) {
                            for (let typeRef of clause.types) {
                                const inheritedTypeName = TypeUtils.getTypeNameFromTypeReference(typeRef);
                                if (!typeMap[inheritedTypeName]) {
                                    const typeRefType = checker.getTypeAtLocation(typeRef);
                                    if (typeRefType) {
                                        getConstituentTypes(typeRefType, metaUtilObj, typeMap);
                                    }
                                }
                            }
                        }
                    }
                }
                if (!isExcludedType(type, metaUtilObj)) {
                    const typeName = isMappedType(type)
                        ? checker.typeToString(type)
                        : TypeUtils.getTypeNameFromType(type);
                    if (!typeMap[typeName]) {
                        typeMap[typeName] = type;
                    }
                }
            }
        }
    };
    const processMembers = function (type, checker, callback) {
        var _a;
        if (!isMappedType(type)) {
            const members = (_a = type.getSymbol()) === null || _a === void 0 ? void 0 : _a.members;
            if (members) {
                members.forEach((memberSymbol, memberKey) => {
                    callback(memberSymbol, memberKey);
                });
            }
        }
        else {
            const propSymbols = checker.getPropertiesOfType(type);
            if (propSymbols) {
                const propCount = propSymbols.length;
                const rootSymbols = propSymbols.map((sym) => {
                    var _a;
                    return (_a = checker.getRootSymbols(sym)) === null || _a === void 0 ? void 0 : _a[0];
                });
                for (let symbol, i = 0; i < propCount; i++) {
                    if (rootSymbols[i]) {
                        symbol = rootSymbols[i];
                        callback(symbol, symbol.getEscapedName(), propSymbols[i]);
                    }
                    else {
                        symbol = propSymbols[i];
                        callback(symbol, symbol.getEscapedName());
                    }
                }
            }
        }
    };
    let typeMap = {};
    getConstituentTypes(type, metaUtilObj, typeMap);
    const typeKeys = Object.keys(typeMap);
    const checker = metaUtilObj.typeChecker;
    for (let k of typeKeys) {
        processMembers(typeMap[k], checker, callback);
    }
}
exports.walkTypeMembers = walkTypeMembers;
function walkTypeNodeMembers(typeNode, metaUtilObj, callback) {
    const typeAtLoc = metaUtilObj.typeChecker.getTypeAtLocation(typeNode);
    walkTypeMembers(typeAtLoc, metaUtilObj, callback);
}
exports.walkTypeNodeMembers = walkTypeNodeMembers;
function updateCompilerPropsMetadata(propsInfo, readOnlyProps, metaUtilObj) {
    if (propsInfo.propsTypeParams) {
        metaUtilObj.fullMetadata["propsTypeParams"] = propsInfo.propsTypeParams;
    }
    if (propsInfo.propsMappedTypes.length > 0) {
        metaUtilObj.fullMetadata["propsMappedTypes"] = propsInfo.propsMappedTypes.slice();
    }
    let declaration = propsInfo.propsGenericsDeclaration;
    if (declaration &&
        (ts.isClassDeclaration(declaration) ||
            ts.isTypeAliasDeclaration(declaration) ||
            ts.isInterfaceDeclaration(declaration))) {
        const propsNode = declaration;
        const genericsInfo = TypeUtils.getGenericsAndTypeParameters(propsNode, true);
        metaUtilObj.fullMetadata["propsClassTypeParamsDeclaration"] =
            genericsInfo === null || genericsInfo === void 0 ? void 0 : genericsInfo.genericsDeclaration;
        metaUtilObj.fullMetadata["propsClassTypeParams"] =
            genericsInfo === null || genericsInfo === void 0 ? void 0 : genericsInfo.genericsTypeParams;
        metaUtilObj.fullMetadata["propsTypeParamsAny"] =
            genericsInfo === null || genericsInfo === void 0 ? void 0 : genericsInfo.genericsTypeParamsAny;
    }
    metaUtilObj.fullMetadata["propsClassName"] = propsInfo.propsName;
    metaUtilObj.fullMetadata["readOnlyProps"] = readOnlyProps;
}
exports.updateCompilerPropsMetadata = updateCompilerPropsMetadata;
function updateCompilerClassMetadata(classNode, metaUtilObj) {
    if (classNode.typeParameters) {
        const genericsInfo = TypeUtils.getGenericsAndTypeParameters(classNode);
        metaUtilObj.fullMetadata["classTypeParamsDeclaration"] =
            genericsInfo === null || genericsInfo === void 0 ? void 0 : genericsInfo.genericsDeclaration;
        metaUtilObj.fullMetadata["classTypeParams"] =
            genericsInfo === null || genericsInfo === void 0 ? void 0 : genericsInfo.genericsTypeParams;
    }
    const classDecorators = DecoratorUtils.getDecorators(classNode, metaUtilObj.aliasToNamedExport);
    const consumedDecorator = classDecorators[metaUtilObj.namedExportToAlias.consumedBindings];
    if (consumedDecorator) {
        metaUtilObj.classConsumedBindingsDecorator = consumedDecorator;
    }
    const providedDecorator = classDecorators[metaUtilObj.namedExportToAlias.providedBindings];
    if (providedDecorator) {
        metaUtilObj.classProvidedBindingsDecorator = providedDecorator;
    }
}
exports.updateCompilerClassMetadata = updateCompilerClassMetadata;
function pruneCompilerMetadata(metaUtilObj) {
    delete metaUtilObj.fullMetadata["classTypeParams"];
    delete metaUtilObj.fullMetadata["classTypeParamsDeclaration"];
    delete metaUtilObj.fullMetadata["propsTypeParams"];
    delete metaUtilObj.fullMetadata["propsMappedTypes"];
    delete metaUtilObj.fullMetadata["propsClassTypeParamsDeclaration"];
    delete metaUtilObj.fullMetadata["propsClassTypeParams"];
    delete metaUtilObj.fullMetadata["propsTypeParamsAny"];
    delete metaUtilObj.fullMetadata["ojLegacyVComponent"];
    delete metaUtilObj.fullMetadata["propsClassName"];
    delete metaUtilObj.fullMetadata["readOnlyProps"];
    pruneMetadata(metaUtilObj.fullMetadata.properties);
    pruneMetadata(metaUtilObj.fullMetadata.events);
}
exports.pruneCompilerMetadata = pruneCompilerMetadata;
function pruneMetadata(metadata) {
    if (metadata && typeof metadata == "object") {
        delete metadata["reftype"];
        delete metadata["optional"];
        delete metadata["isArrayOfObject"];
        delete metadata["evnDetailTypeParamsDeclaration"];
        delete metadata["evnDetailNameTypeParams"];
        for (let prop in metadata) {
            pruneMetadata(metadata[prop]);
        }
    }
}
exports.pruneMetadata = pruneMetadata;
function updateRtExtensionMetadata(name, value, metaUtilObj) {
    if (!metaUtilObj.rtMetadata.extension) {
        metaUtilObj.rtMetadata.extension = {};
    }
    metaUtilObj.rtMetadata.extension[name] = value;
}
exports.updateRtExtensionMetadata = updateRtExtensionMetadata;
function _getObservedGlobalPropsArray(refNode) {
    var _a;
    let observedProps = [];
    const node = (_a = refNode.typeArguments) === null || _a === void 0 ? void 0 : _a[0];
    if (ts.isLiteralTypeNode(node)) {
        const literal = node.literal;
        if (ts.isStringLiteral(literal)) {
            observedProps.push(literal.text);
        }
    }
    else if (ts.isUnionTypeNode(node)) {
        observedProps = observedProps.concat(TypeUtils.getEnumStringsFromUnion(node));
    }
    return observedProps;
}
function _getDtMetadataNameValue(tag, metaUtilObj) {
    const comment = tag.comment.trim();
    const mdkeySep = comment.indexOf(" ");
    let mdKey, mdVal;
    if (mdkeySep > 0) {
        mdKey = comment.substr(0, mdkeySep);
        mdVal = comment.substr(mdkeySep + 1);
        try {
            mdVal = _execBundle(mdVal);
        }
        catch (e) {
            console.log(`${metaUtilObj.componentClassName}: Malformed metadata value ${mdVal} for key ${mdKey}.`);
        }
    }
    else {
        mdKey = comment;
        mdVal = true;
    }
    return [mdKey, mdVal];
}
function _metadataToAstNodes(value) {
    if (Array.isArray(value)) {
        return ts.factory.createArrayLiteralExpression(value.map((item) => _metadataToAstNodes(item)));
    }
    switch (typeof value) {
        case "string":
            return ts.factory.createStringLiteral(value);
        case "number":
            return ts.factory.createNumericLiteral(String(value));
        case "boolean":
            return value ? ts.factory.createTrue() : ts.factory.createFalse();
        case "object":
            if (!value) {
                return ts.factory.createNull();
            }
            const keys = Object.keys(value);
            return ts.factory.createObjectLiteralExpression(keys.map((key) => {
                return ts.factory.createPropertyAssignment(ts.factory.createStringLiteral(key), _metadataToAstNodes(value[key]));
            }));
    }
}
function _execBundle(src) {
    const script = new vm.Script(`ret(${src})`);
    const result = script.runInContext(vm.createContext({
        ret: function (t) {
            return t;
        },
    }));
    return result;
}
