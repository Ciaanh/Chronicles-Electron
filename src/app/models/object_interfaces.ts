export type DbObject = {
    id: number;
};

export type Dto = {
    _id: number;
};

export class DisplayedObject<T extends Dto> {
    private object: T;
    private open: boolean;

    constructor(object: T, open: boolean) {
        this.object = object;
        this.open = open;
    }

    public get Object(): T {
        return this.object;
    }
    public get IsOpen(): boolean {
        return this.open;
    }
    public set IsOpen(isOpen: boolean) {
        this.open = isOpen;
    }
}
