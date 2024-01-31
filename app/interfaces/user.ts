import { Contact } from "./contact";

export interface User {
    name: string;
    email: string;
    id: string;
    contacts: Contact[];
}
