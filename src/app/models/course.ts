export class Course {
    id: string;
    active: boolean;
    name: string;
    categoryId: string;
    categoryName: string;
    categoryImage: string;
    questions: Array<Questions>;
}

class Questions {
    name: string;
    answers: Array<Answers>
}

class Answers {
    isAnswer: boolean;
    name: string;
}