/*
 * @Description: Protobuf 字段解析模块
 * @Usage: 提取 proto 文件中的消息字段定义
 * @Author: richen
 * @Date: 2021-11-23 23:19:07
 * @LastEditTime: 2025-01-28
 */
import { IType, IField, IMapField } from 'protobufjs';
import { OptionType } from './interface';

const TYPES: Readonly<{ [key: string]: string }> = Object.freeze({
  double: 'number',
  float: 'number',
  int32: 'number',
  int64: 'string',
  uint32: 'number',
  uint64: 'string',
  sint32: 'number',
  sint64: 'string',
  fixed32: 'number',
  fixed64: 'string',
  sfixed32: 'number',
  sfixed64: 'string',
  bool: 'boolean',
  string: 'string',
  bytes: 'string'
});

/**
 * 字段解析结果类型
 */
export interface FieldResult {
  name: string;
  fields: string[];
}

/**
 * 获取 Map 类型键的类型
 *
 * @param p - Map 字段定义
 * @returns 键的 TypeScript 类型
 */
function getKeyType(p: Partial<IMapField>): string {
  if (p.keyType && Object.prototype.hasOwnProperty.call(TYPES, p.keyType)) {
    return TYPES[p.keyType];
  }
  return p.keyType || '';
}

/**
 * 读取字段信息
 *
 * @param name - 消息名称
 * @param content - 字段内容对象
 * @returns 字段信息对象
 */
function readField(
  name: string,
  content: { [k: string]: IField }
): { category: string; name: string; params: Array<{ type: string; keyType: string; name: string; rule: string | undefined; id: number }> } {
  const params = Object.keys(content).map(paramName => {
    const paramValue = content[paramName];
    const type = TYPES[paramValue.type] || paramValue.type;
    const keyType = getKeyType(paramValue as Partial<IMapField>);

    return { type, keyType, name: paramName, rule: paramValue.rule, id: paramValue.id };
  });

  return { category: 'fields', name, params: params.sort((a, b) => a.id - b.id) };
}

/**
 * 打印字段定义
 *
 * @export
 * @param {string} name - 消息名称
 * @param {IType} fieldParams - 消息类型定义
 * @param {OptionType} _options - 解析选项
 * @returns {FieldResult} 字段定义结果
 */
export function printField(name: string, fieldParams: IType, _options: OptionType): FieldResult {
  const content = fieldParams.fields;
  const item = readField(name, content);

  const arrs = item.params.map(param => {
    if (param.rule === 'repeated') {
      return `  ${param.name}: ${param.type}[];`;
    }
    if (param.keyType) {
      return `  ${param.name}: {[key: ${param.keyType}]: ${param.type}};`;
    }
    return `  ${param.name}: ${param.type};`;
  });

  return { name: item.name, fields: arrs };
}