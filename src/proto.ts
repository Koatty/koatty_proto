/*
 * @Description: 
 * @Usage: 
 * @Author: richen
 * @Date: 2021-12-13 16:33:32
 * @LastEditTime: 2024-11-06 18:37:12
 */
import { GrpcObject, loadPackageDefinition, ServiceDefinition } from "@grpc/grpc-js";
import { loadSync, Options, ProtobufTypeDefinition } from "@grpc/proto-loader";
import { Helper } from "koatty_lib";

/**
 *
 *
 * @export
 * @interface ProtoDef
 */
export interface ProtoDef {
  name: string;
  service: ServiceDefinition;
  handlers: ProtoDefHandler[];
}

export interface ProtoDefHandler {
  name: string;
  path: string;
  fn?: (...args: any[]) => any;
}

/**
 * LoadProto
 *
 * @export
 * @param {string} protoFile
 * @returns {*}  
 */
export function LoadProto(protoFile: string, options: Options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
}): GrpcObject {
  if (!Helper.isFile(protoFile)) {
    throw new Error("no such file: " + protoFile);
  }
  // Loading file
  const parsedObj = loadSync(protoFile, options);
  return loadPackageDefinition(parsedObj);
}

/**
 * ListServices - 递归解析服务定义，支持循环引用检测
 *
 * @export
 * @param {GrpcObject | ProtobufTypeDefinition} def - 要解析的定义对象
 * @param {Set<any>} [visited] - 用于检测循环引用的访问记录集合
 * @returns {ProtoDef[]} 解析后的服务定义数组
 */
export function ListServices(
  def: GrpcObject | ProtobufTypeDefinition, 
  visited: Set<any> = new Set()
): ProtoDef[] {
  const results: ProtoDef[] = [];
  
  // 循环引用检测
  if (visited.has(def)) {
    return results;
  }
  
  // 添加到访问记录
  visited.add(def);
  
  try {
    for (const [propName, value] of Object.entries(def)) {
      if (value) {
        if (typeof value === "function" && value.hasOwnProperty('service')) {
          const service = (value as any).service;
          const handlers = [];
          for (const key in service) {
            if (Object.hasOwnProperty.call(service, key)) {
              const element = service[key];
              handlers.push({
                name: key,
                path: element.path,
              })
            }
          }
          results.push({
            name: propName,
            service: service,
            handlers: handlers,
          });
        } else if (Helper.isObject(value)) {
          // 递归调用时传递 visited 集合
          results.push(...ListServices(value, visited));
        }
      }
    }
  } finally {
    // 在当前层级处理完成后，从访问记录中移除当前对象
    // 这样允许在不同的分支中访问同一个对象
    visited.delete(def);
  }
  
  return results;
}

