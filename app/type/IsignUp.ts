export interface ISignUp {
    name: string;
    email: string;
    phone: number;
    designation?: string;
    department?: string;
    year?: string;
    secretCode?: string;
    password: string;
    role: "admin" | "student";
}