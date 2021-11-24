/*
 * @Description: 
 * @Usage: 
 * @Author: richen
 * @Date: 2021-11-23 23:07:11
 * @LastEditTime: 2021-11-24 10:10:11
 */
import protobufjs, { IService, IType, IEnum, Root } from 'protobufjs';
import { printEnum } from './Enum';
import { printField } from './field';
import { OptionType } from './interface';
import { printMethod } from './method';

/**
 * defaultOptions
 *
 * @interface OptionType
 */
const defaultOptions: OptionType = {
    isDefinition: false
};

/**
 *
 *
 * @export
 * @param {string} source
 * @returns {protobufjs.INamespace}  
 */
export function parseProto(source: string): protobufjs.INamespace {
    const res = protobufjs.parse(source, { keepCase: true });
    return parseProtoRoot(res.root, res.package);
}

/**
 * parseMethods
 *
 * @export
 * @param {protobufjs.INamespace} json
 * @param {OptionType} [options]
 * @returns {*}  {string[]}
 */
export function parseMethods(json: protobufjs.INamespace, options?: OptionType): string[] {
    if (!options) {
        options = defaultOptions;
    }
    const nested = json.nested;
    const res: any = {};
    if (nested) {
        for (const name in nested) {
            if (Object.prototype.hasOwnProperty.call(nested, name)) {
                const value = nested[name];
                Object.keys(value).map(category => {
                    if (category === 'methods') {
                        res[name] = printMethod(name, value as IService, options);
                    }
                    if (category === 'nested') {
                        res[name] = parseMethods(value, options);
                    }
                });
            }
        }
    }
    return res;
}

/**
 * parseFields
 *
 * @export
 * @param {protobufjs.INamespace} json
 * @param {OptionType} [options]
 * @returns {*}  {string[]}
 */
export function parseFields(json: protobufjs.INamespace, options?: OptionType): string[] {
    if (!options) {
        options = defaultOptions;
    }
    const nested = json.nested;
    const res: any = {};
    if (nested) {
        for (const name in nested) {
            if (Object.prototype.hasOwnProperty.call(nested, name)) {
                const value = nested[name];
                Object.keys(value).map(category => {
                    if (category === 'fields') {
                        res[name] = printField(name, value as IType, options);
                    }
                    if (category === 'values') {
                        res[name] = printEnum(name, value as IEnum, options);
                    }
                    if (category === 'nested') {
                        res[name] = parseFields(value, options);
                    }
                });
            }
        }
    }
    return res;
}

/**
 *
 *
 * @export
 * @param {Root} root
 * @param {OptionType} options
 * @param {string} [packageName]
 * @returns {*}  
 */
export function parseProtoRoot(root: Root, packageName?: string) {
    if (packageName) {
        const _root = root.lookup(packageName);
        return _root?.toJSON();
    }
    return root.toJSON();
}