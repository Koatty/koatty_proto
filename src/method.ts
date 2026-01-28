/*
 * @Description: Protobuf 方法解析模块
 * @Usage: 提取 proto 文件中的 RPC 方法定义
 * @Author: richen
 * @Date: 2021-11-23 23:20:51
 * @LastEditTime: 2025-01-28
 */
import { IService, IMethod } from 'protobufjs';
import { OptionType } from './interface';

const EMPTY = 'google.protobuf.Empty';

/**
 * 方法解析结果类型
 */
export interface MethodResult {
  name: string;
  requestType: string;
  responseType: string;
}

/**
 * 读取方法参数
 *
 * @param name - 方法名称
 * @param content - 方法内容对象
 * @returns 方法参数信息
 */
function readMethod(name: string, content: { [k: string]: IMethod }): { category: string; name: string; params: Array<{ name: string; requestType: string; responseType: string }> } {
  const params = Object.keys(content).map(paramName => {
    const paramValue = content[paramName];
    const requestType = paramValue.requestType === EMPTY ? '' : paramValue.requestType;
    const responseType = paramValue.responseType === EMPTY ? 'any' : paramValue.responseType;

    return { name: paramName, requestType, responseType };
  });

  return { category: 'methods', name, params };
}

/**
 * 打印方法定义
 *
 * @export
 * @param {string} name - 服务名称
 * @param {IService} methodContent - 服务定义对象
 * @param {OptionType} _options - 解析选项
 * @returns {MethodResult[]} 方法定义数组
 */
export function printMethod(
  name: string,
  methodContent: IService,
  _options: OptionType
): MethodResult[] {
  const content = methodContent.methods;
  const item = readMethod(name, content);
  return item.params;
}