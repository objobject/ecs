export class Component<C> {
	name: string;
	value: C;

	constructor(name: string, data: C) {
		this.name = name;
		this.value = data;
	}
}