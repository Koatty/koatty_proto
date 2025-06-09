/*
 * @Description: 循环引用检测测试
 * @Usage: 测试修复后的函数是否能正确处理循环引用
 * @Author: richen
 * @Date: 2024-11-06 18:40:00
 */
import { ListServices, parseFields, parseMethods, parseValues } from "../src/index";

describe("Circular Reference Protection", () => {
  test("ListServices should handle circular references", () => {
    // 创建一个包含循环引用的对象
    const obj1: any = {
      name: "test1",
      service: {},
    };
    const obj2: any = {
      name: "test2", 
      nested: obj1
    };
    
    // 创建循环引用
    obj1.nested = obj2;
    
    const testObj = {
      test: obj1
    };

    // 应该不会抛出错误或进入无限循环
    expect(() => {
      const result = ListServices(testObj);
      expect(Array.isArray(result)).toBe(true);
    }).not.toThrow();
  });

  test("parseFields should handle circular references", () => {
    // 创建包含循环引用的命名空间对象
    const namespace1: any = {
      nested: {}
    };
    const namespace2: any = {
      nested: {
        child: namespace1
      }
    };
    
    // 创建循环引用
    namespace1.nested.parent = namespace2;

    // 应该不会抛出错误或进入无限循环
    expect(() => {
      const result = parseFields(namespace1);
      expect(typeof result).toBe('object');
    }).not.toThrow();
  });

  test("parseMethods should handle circular references", () => {
    // 创建包含循环引用的命名空间对象
    const namespace1: any = {
      nested: {}
    };
    const namespace2: any = {
      nested: {
        child: namespace1
      }
    };
    
    // 创建循环引用
    namespace1.nested.parent = namespace2;

    // 应该不会抛出错误或进入无限循环
    expect(() => {
      const result = parseMethods(namespace1);
      expect(typeof result).toBe('object');
    }).not.toThrow();
  });

  test("parseValues should handle circular references", () => {
    // 创建包含循环引用的命名空间对象
    const namespace1: any = {
      nested: {}
    };
    const namespace2: any = {
      nested: {
        child: namespace1
      }
    };
    
    // 创建循环引用
    namespace1.nested.parent = namespace2;

    // 应该不会抛出错误或进入无限循环
    expect(() => {
      const result = parseValues(namespace1);
      expect(typeof result).toBe('object');
    }).not.toThrow();
  });

  test("Multiple calls with same object should work correctly", () => {
    const testObj: any = {
      service1: {
        name: "service1",
        service: {}
      },
      service2: {
        name: "service2", 
        service: {}
      }
    };

    // 多次调用应该得到相同的结果
    const result1 = ListServices(testObj);
    const result2 = ListServices(testObj);
    
    expect(result1).toEqual(result2);
    expect(Array.isArray(result1)).toBe(true);
    expect(Array.isArray(result2)).toBe(true);
  });
}); 