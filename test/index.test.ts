/*
 * @Description: 
 * @Usage: 
 * @Author: richen
 * @Date: 2021-11-23 23:24:07
 * @LastEditTime: 2021-11-24 10:30:16
 */
import assert from "assert";
import { readFileSync } from "fs";
import path from "path";
import { parseFields, parseMethods, parseProto } from "../src/index";

const protoFile = path.resolve("./test/hello.proto");

describe("protobuf", () => {
    let res: any, fields: any, methods: any;
    test("LoadProto", async function () {
        console.log(protoFile);
        try {
            const source = readFileSync(protoFile)
            res = parseProto(source.toString());
        } catch (error) {
            assert.fail("error");
        }
    });
    test("parseMethods", async function () {
        methods = parseMethods(res);
        console.log(methods);
        assert.equal(Object.hasOwnProperty.call(methods, "Greeter"), true);
        assert.equal(methods.Greeter.length, 2);
    });
    test("parseFields", async function () {
        fields = parseFields(res);
        console.log(fields);
        assert.equal(Object.hasOwnProperty.call(fields, "HelloRequest"), true);
        assert.equal(Object.hasOwnProperty.call(fields, "HelloReply"), true);
        assert.equal(Object.hasOwnProperty.call(fields, "PhoneType"), true);
    });
});

