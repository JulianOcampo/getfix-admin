export class CourseResult {
    courseId: string;
    categoryId: string;
    workerId: string;
    categoryName: string;
    duration: string;
    score: number;
    courseState: number;
    courseStateText: string;
    questionsAndAnswers: Array<Questions>;
}

class Questions {
    question: string;
    answers: Answers
}

class Answers {
    isAnswer: boolean;
    name: string;
}