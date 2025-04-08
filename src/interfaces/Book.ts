interface BookInterface{
    title: string;
    autor: string;
    coverImg: string;
    printYear: number;
    printCompany: string;
    condition: grading;
    description: string;
    status: status;
    submitDate: Date;
}

export default BookInterface