export type Values<T> = T[keyof T];
export type FlattenValue = string | number | boolean | Function;
export type FlattenPairs<T> = {[K in keyof T]: T[K] extends FlattenValue ? [K, T[K]] : FlattenPairs<T[K]>}[keyof T] & [PropertyKey, FlattenValue];
export type Flatten<T> = {[P in FlattenPairs<T> as P[0]]: P[1]}

export interface ComponentI<T extends Record<string, unknown> = {}> {
	name: string;
	value: T;
}