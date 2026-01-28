/*
 * @Description: Protobuf 枚举解析模块
 * @Usage: 提取 proto 文件中的枚举定义
 * @Author: richen
 * @Date: 2021-11-23 23:15:56
 * @LastEditTime: 2025-01-28
 */
import { IEnum } from 'protobufjs';
import { OptionType } from './interface';

/**
 * 枚举解析结果类型
 */
export interface EnumResult {
  name: string;
  fields: string[];
}

/**
 * 打印枚举定义
 *
 * @export
 * @param {string} name - 枚举名称
 * @param {IEnum} enumContent - 枚举内容对象
 * @param {OptionType} _options - 解析选项
 * @returns {EnumResult} 枚举定义结果
 */
export function printEnum(name: string, enumContent: IEnum, _options: OptionType): EnumResult {
  const content = enumContent.values;
  const item = Object.keys(content)
    .map(key => ({ name: key, id: content[key] }))
    .sort((a, b) => a.id - b.id);
  const arr = item.map(s => `  ${s.name} = "${s.id}",`);

  return { name, fields: arr };
}