export type Values<T> = T[keyof T]
export type Primitive = string | number | boolean
export type FlattenPairs<T> = {[K in keyof T]: T[K] extends Primitive ? [K, T[K]] : FlattenPairs<T[K]>}[keyof T] & [PropertyKey, Primitive]
export type Flatten<T> = {[P in FlattenPairs<T> as P[0]]: P[1]}

export interface ComponentI<T extends Record<string, unknown> = {}> {
	name: string;
	value: T;
}