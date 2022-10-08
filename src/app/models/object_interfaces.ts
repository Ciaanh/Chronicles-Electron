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

export class EditededObject<T extends Dto> {
    private object: T;
    private creation: boolean;

    constructor(object: T, creation: boolean) {
        this.object = object;
        this.creation = creation;
    }

    public get Object(): T {
        return this.object;
    }
    public get IsCreation(): boolean {
        return this.creation;
    }
    public set IsCreation(isCreation: boolean) {
        this.creation = isCreation;
    }
}
