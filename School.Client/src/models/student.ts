export interface Student{
    id: string;
    imageUrl: string;
    firstName: string;
    lastName: string;
    identityNumber:string;
    email: string;
    phoneNumber: string;
}

export const initialStudent : Student = {
    id: '',
    imageUrl: '',
    firstName: '',
    lastName: '',
    identityNumber: '',
    email: '',
    phoneNumber: ''
}