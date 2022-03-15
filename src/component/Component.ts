import { ComponentI } from "../types";

export class Component<T extends Record<string, unknown> = {}> implements ComponentI {
	name: string;
	value: T;

	constructor(name: string, data: T) {
		this.name = name;
		this.value = data;
	}
}