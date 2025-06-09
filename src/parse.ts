/*
 * @Description: 
 * @Usage: 
 * @Author: richen
 * @Date: 2021-12-13 16:32:47
 * @LastEditTime: 2023-01-13 10:20:23
 */
import protobufjs, { IService, IType, IEnum, Root } from 'protobufjs';
import { printEnum } from './enum';
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
 * parseProto
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
 * parseMethods - 递归解析方法定义，支持循环引用检测
 *
 * @export
 * @param {protobufjs.INamespace} json - 要解析的命名空间对象
 * @param {OptionType} [options] - 解析选项
 * @param {Set<any>} [visited] - 用于检测循环引用的访问记录集合
 * @returns {object} 解析后的方法定义对象
 */
export function parseMethods(
  json: protobufjs.INamespace, 
  options?: OptionType, 
  visited: Set<any> = new Set()
): object {
  if (!options) {
    options = defaultOptions;
  }
  
  // 循环引用检测
  if (visited.has(json)) {
    return {};
  }
  
  visited.add(json);
  
  const nested = json.nested;
  const res: any = {};
  
  try {
    if (nested) {
      for (const name in nested) {
        if (Object.prototype.hasOwnProperty.call(nested, name)) {
          const value = nested[name];
          Object.keys(value).map(category => {
            if (category === 'methods') {
              res[name] = printMethod(name, value as IService, options);
            }
            if (category === 'nested') {
              res[name] = parseMethods(value, options, visited);
            }
          });
        }
      }
    }
  } finally {
    visited.delete(json);
  }
  
  return res;
}

/**
 * parseFields - 递归解析字段定义，支持循环引用检测
 *
 * @export
 * @param {protobufjs.INamespace} json - 要解析的命名空间对象
 * @param {OptionType} [options] - 解析选项
 * @param {Set<any>} [visited] - 用于检测循环引用的访问记录集合
 * @returns {object} 解析后的字段定义对象
 */
export function parseFields(
  json: protobufjs.INamespace, 
  options?: OptionType, 
  visited: Set<any> = new Set()
): object {
  if (!options) {
    options = defaultOptions;
  }
  
  // 循环引用检测
  if (visited.has(json)) {
    return {};
  }
  
  visited.add(json);
  
  const nested = json.nested;
  const res: any = {};
  
  try {
    if (nested) {
      for (const name in nested) {
        if (Object.prototype.hasOwnProperty.call(nested, name)) {
          const value = nested[name];
          Object.keys(value).map(category => {
            if (category === 'fields') {
              res[name] = printField(name, value as IType, options);
            }
            if (category === 'nested') {
              res[name] = parseFields(value, options, visited);
            }
          });
        }
      }
    }
  } finally {
    visited.delete(json);
  }
  
  return res;
}

/**
 * parseValues - 递归解析枚举值定义，支持循环引用检测
 *
 * @export
 * @param {protobufjs.INamespace} json - 要解析的命名空间对象
 * @param {OptionType} [options] - 解析选项
 * @param {Set<any>} [visited] - 用于检测循环引用的访问记录集合
 * @returns {object} 解析后的枚举值定义对象
 */
export function parseValues(
  json: protobufjs.INamespace, 
  options?: OptionType, 
  visited: Set<any> = new Set()
): object {
  if (!options) {
    options = defaultOptions;
  }
  
  // 循环引用检测
  if (visited.has(json)) {
    return {};
  }
  
  visited.add(json);
  
  const nested = json.nested;
  const res: any = {};
  
  try {
    if (nested) {
      for (const name in nested) {
        if (Object.prototype.hasOwnProperty.call(nested, name)) {
          const value = nested[name];
          Object.keys(value).map(category => {
            if (category === 'values') {
              res[name] = printEnum(name, value as IEnum, options);
            }
            if (category === 'nested') {
              res[name] = parseValues(value, options, visited);
            }
          });
        }
      }
    }
  } finally {
    visited.delete(json);
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
 * @returns {protobufjs.INamespace}  
 */
export function parseProtoRoot(root: Root, packageName?: string): any {
  if (packageName) {
    const _root = root.lookup(packageName);
    return _root?.toJSON();
  }
  return root.toJSON();
}