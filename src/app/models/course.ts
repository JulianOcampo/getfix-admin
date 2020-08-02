export class Course {
    active: boolean;
    categoryId: string;
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