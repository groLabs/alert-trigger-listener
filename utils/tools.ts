import config from "config";
const BN = require("bignumber.js");
const logger = require("./logger");

export function getConfig(key: string, existCheck: boolean = true): any {
  if (config.has(key)) return config.get(key);

  if (existCheck) {
    const err = new Error(`Config: ${key} not set.`);
    logger.error(err);
    throw err;
  }

  return undefined;
}

export function plus(items: any[]) {
  let result = BN(0);
  for (let i = 0; i < items.length; i += 1) {
    result = result.plus(BN(items[i].toString()));
  }
  return result.toFixed();
}

export function sub(subtraction: any, minuends: any[]) {
  let result = BN(subtraction.toString());
  for (let i = 0; i < minuends.length; i += 1) {
    result = result.minus(BN(minuends[i].toString()));
  }
  return result.toFixed();
}

export function divide(divisor: any, dividend: any) {
  if (dividend.toString() === "0") return "0";
  const result = BN(divisor.toString())
    .dividedBy(BN(dividend.toString()))
    .abs();
  return result.toFixed();
}

export function percentToBPS(percent: any) {
  return parseInt(BN(percent.toString()).multipliedBy(10000).toFixed(0));
}

export function isEqual(item1: any, item2: any) {
  return BN(item1.toString()).isEqualTo(item2.toString());
}

export function removeDecimals(
  data: string = "0",
  decimals: number = 18,
  precision: number = 2
) {
  const tempNum = BN(data.toString()).div(BN(10).pow(decimals));
  const result = tempNum.toFixed(precision);
  return result;
}

export function shortTXHash(
  accountAddress: string | undefined,
  fixed: number = 6
) {
  if (accountAddress) return accountAddress.substring(0, fixed);
  return "";
}
