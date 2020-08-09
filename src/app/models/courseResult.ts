export interface CourseResult {
    courseId: string;
    categoryId: string;
    workerId: string;
    duration: string;
    questionsAndAnswers: Array<Questions>;
}

interface Questions {
    question: string;
    answers: Answers
}

interface Answers {
    isAnswer: boolean;
    name: string;
}