import { DBobject } from "./DBobject";
import { Locale } from "./locale";

export interface Timeline extends DBobject {
    name: string;
    label: Locale;
}
