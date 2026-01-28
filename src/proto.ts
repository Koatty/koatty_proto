/*
 * @Description: Protobuf 文件加载模块
 * @Usage: 加载 proto 文件并解析为 gRPC 服务定义
 * @Author: richen
 * @Date: 2021-12-13 16:33:32
 * @LastEditTime: 2025-01-28
 */
import { GrpcObject, loadPackageDefinition, ServiceDefinition } from '@grpc/grpc-js';
import { loadSync, Options, ProtobufTypeDefinition } from '@grpc/proto-loader';
import { Helper } from 'koatty_lib';

/**
 * 服务处理器定义
 */
export interface ProtoDefHandler {
  name: string;
  path: string;
  fn?: (...args: any[]) => any;
}

/**
 * 服务定义
 */
export interface ProtoDef {
  name: string;
  service: ServiceDefinition;
  handlers: ProtoDefHandler[];
}

/**
 * 默认加载选项
 */
const DEFAULT_LOAD_OPTIONS: Readonly<Options> = Object.freeze({
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

/**
 * 加载并解析 Protobuf 文件
 *
 * @export
 * @param {string} protoFile - Proto 文件路径
 * @param {Options} [options] - 加载选项
 * @returns {GrpcObject} 加载后的 gRPC 对象
 * @throws {Error} 文件不存在或加载失败
 */
export function LoadProto(protoFile: string, options?: Options): GrpcObject {
  if (!protoFile || typeof protoFile !== 'string') {
    throw new Error('Invalid proto file path');
  }

  if (!Helper.isFile(protoFile)) {
    throw new Error(`Proto file not found: ${protoFile}`);
  }

  const loadOptions = options ? { ...DEFAULT_LOAD_OPTIONS, ...options } : DEFAULT_LOAD_OPTIONS;
  const parsedObj = loadSync(protoFile, loadOptions);
  return loadPackageDefinition(parsedObj);
}

/**
 * 递归解析服务定义，支持循环引用检测
 *
 * @export
 * @param {GrpcObject | ProtobufTypeDefinition} def - 要解析的定义对象
 * @param {Set<unknown>} [visited] - 用于检测循环引用的访问记录集合
 * @returns {ProtoDef[]} 解析后的服务定义数组
 */
export function ListServices(
  def: GrpcObject | ProtobufTypeDefinition,
  visited: Set<unknown> = new Set()
): ProtoDef[] {
  if (!def || typeof def !== 'object') {
    return [];
  }

  if (visited.has(def)) {
    return [];
  }

  visited.add(def);

  const results: ProtoDef[] = [];

  try {
    for (const [propName, value] of Object.entries(def)) {
      if (value && typeof value === 'object') {
        if ('service' in value && typeof (value as { service: unknown }).service === 'object') {
          const service = (value as { service: ServiceDefinition }).service;
          const handlers: ProtoDefHandler[] = [];

          for (const key in service) {
            if (Object.prototype.hasOwnProperty.call(service, key)) {
              const element = service[key];
              handlers.push({ name: key, path: element.path });
            }
          }

          results.push({ name: propName, service, handlers });
        } else if (!('type' in value)) {
          results.push(...ListServices(value as GrpcObject, visited));
        }
      }
    }
  } finally {
    visited.delete(def);
  }

  return results;
}

