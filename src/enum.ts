/*
 * @Description: 
 * @Usage: 
 * @Author: richen
 * @Date: 2021-11-23 23:15:56
 * @LastEditTime: 2021-12-13 15:57:37
 */
import { IEnum } from 'protobufjs';
import { OptionType } from './interface';

/**
 * 
 *
 * @export
 * @param {string} name
 * @param {IEnum} enumContent
 * @param {OptionType} options
 * @returns {*}  
 */
export function printEnum(name: string, enumContent: IEnum, options: OptionType) {
    const content = enumContent.values;
    const item = Object.keys(content)
        .map(key => ({
            name: key,
            id: content[key]
        }))
        .sort((a, b) => a.id - b.id);
    const arr = item.map(s => `  ${s.name} = "${s.id}",`);
    return {
        name,
        fields: arr,
    };
}