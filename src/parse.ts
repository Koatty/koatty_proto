/*
 * @Description: Protobuf 协议解析模块
 * @Usage: 提供 proto 文件解析、方法/字段/枚举值提取功能
 * @Author: richen
 * @Date: 2021-12-13 16:32:47
 * @LastEditTime: 2025-01-28
 */
import protobufjs, { IService, IType, IEnum, Root } from 'protobufjs';
import { printEnum, EnumResult } from './enum';
import { printField, FieldResult } from './field';
import { OptionType } from './interface';
import { printMethod, MethodResult } from './method';

/**
 * 解析类别类型
 */
type ParseCategory = 'methods' | 'fields' | 'values';

/**
 * 处理器函数类型
 */
type ProcessorFunction = (name: string, value: any, options: OptionType) => any;

/**
 * 默认解析选项
 */
const DEFAULT_OPTIONS: Readonly<OptionType> = Object.freeze({
  isDefinition: false
});



/**
 * parseProto
 *
 * @export
 * @param {string} source - Protobuf 源文件内容
 * @returns {protobufjs.INamespace} 解析后的命名空间对象
 */
export function parseProto(source: string): protobufjs.INamespace {
  const res = protobufjs.parse(source, { keepCase: true });
  return parseProtoRoot(res.root, res.package);
}

/**
 * 通用类别解析函数 - 消除代码重复的核心函数
 *
 * @param json - 要解析的命名空间对象
 * @param category - 解析类别 ('methods' | 'fields' | 'values')
 * @param processor - 处理器函数
 * @param options - 解析选项
 * @param visited - 用于检测循环引用的访问记录集合
 * @returns 解析后的结果对象
 */
function parseCategory(
  json: protobufjs.INamespace,
  category: ParseCategory,
  processor: ProcessorFunction,
  options: OptionType = DEFAULT_OPTIONS,
  visited: Set<any> = new Set()
): Record<string, unknown> {
  if (!json || typeof json !== 'object') {
    return {};
  }

  if (visited.has(json)) {
    return {};
  }

  visited.add(json);

  const result: Record<string, unknown> = {};
  const nested = json.nested;

  try {
    if (nested) {
      for (const name of Object.keys(nested)) {
        const value = nested[name];
        if (value && typeof value === 'object') {
          if (category in value) {
            result[name] = processor(name, value, options);
          }
          if ('nested' in value && value.nested) {
            const nestedResult = parseCategory(
              value.nested as protobufjs.INamespace,
              category,
              processor,
              options,
              visited
            );
            if (Object.keys(nestedResult).length > 0) {
              result[name] = nestedResult;
            }
          }
        }
      }
    }
  } finally {
    visited.delete(json);
  }

  return result;
}

/**
 * 打印方法定义
 *
 * @export
 * @param {string} name - 服务名称
 * @param {IService} methodContent - 服务定义对象
 * @param {OptionType} _options - 解析选项
 * @returns {unknown} 方法定义数组
 */
export function printMethod(
  name: string,
  methodContent: IService,
  _options: OptionType
): unknown {
  const content = methodContent.methods;
  const item = readMethod(name, content);
  return item.params;
}

/**
 * parseMethods - 递归解析方法定义，支持循环引用检测
 *
 * @export
 * @param {protobufjs.INamespace} json - 要解析的命名空间对象
 * @param {OptionType} [options] - 解析选项
 * @param {Set<any>} [visited] - 用于检测循环引用的访问记录集合
 * @returns {Record<string, MethodResult[]>} 解析后的方法定义对象
 */
export function parseMethods(
  json: protobufjs.INamespace,
  options?: OptionType,
  visited?: Set<any>
): Record<string, MethodResult[]> {
  const processor: ProcessorFunction = (name: string, value: any) =>
    printMethod(name, value as IService, options ?? DEFAULT_OPTIONS);
  return parseCategory(json, 'methods', processor, options, visited) as Record<string, MethodResult[]>;
}

/**
 * parseFields - 递归解析字段定义，支持循环引用检测
 *
 * @export
 * @param {protobufjs.INamespace} json - 要解析的命名空间对象
 * @param {OptionType} [options] - 解析选项
 * @param {Set<any>} [visited] - 用于检测循环引用的访问记录集合
 * @returns {Record<string, FieldResult>} 解析后的字段定义对象
 */
export function parseFields(
  json: protobufjs.INamespace,
  options?: OptionType,
  visited?: Set<any>
): Record<string, FieldResult> {
  const processor: ProcessorFunction = (name: string, value: any) =>
    printField(name, value as IType, options ?? DEFAULT_OPTIONS);
  return parseCategory(json, 'fields', processor, options, visited) as Record<string, FieldResult>;
}

/**
 * parseValues - 递归解析枚举值定义，支持循环引用检测
 *
 * @export
 * @param {protobufjs.INamespace} json - 要解析的命名空间对象
 * @param {OptionType} [options] - 解析选项
 * @param {Set<any>} [visited] - 用于检测循环引用的访问记录集合
 * @returns {Record<string, EnumResult>} 解析后的枚举值定义对象
 */
export function parseValues(
  json: protobufjs.INamespace,
  options?: OptionType,
  visited?: Set<any>
): Record<string, EnumResult> {
  const processor: ProcessorFunction = (name: string, value: any) =>
    printEnum(name, value as IEnum, options ?? DEFAULT_OPTIONS);
  return parseCategory(json, 'values', processor, options, visited) as Record<string, EnumResult>;
}

/**
 * 解析 Protobuf Root 对象为 JSON
 *
 * @export
 * @param {Root} root - Protobuf Root 对象
 * @param {OptionType} options - 解析选项
 * @param {string} [packageName] - 可选的包名称
 * @returns {protobufjs.INamespace} 解析后的命名空间对象
 */
export function parseProtoRoot(root: Root, packageName?: string): protobufjs.INamespace {
  if (packageName && typeof packageName === 'string') {
    const _root = root.lookup(packageName);
    return _root?.toJSON() as protobufjs.INamespace;
  }
  return root.toJSON() as protobufjs.INamespace;
}