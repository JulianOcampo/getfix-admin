export class Model {
    id: string;
    name: string;
    description: string;
    image: string;
    active: boolean;
    brandName: string;
    categoryName: string;
    brandId: string;
    categoryId: string;
    year: number;
    colors: Array<colors>;
    issues: Array<issues>;
}

class colors {
    id: string;
    name: string;
    hexaValue: string;
}
class issues {
    id: string;
    title: string;
    description: string;
    price: number;
    active: boolean;
}