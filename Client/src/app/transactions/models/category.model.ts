import { Id } from '@aug/common/id';

export interface Category {
    id: Id<Category>;
    name: string;
    subCategories?: Category[];
}