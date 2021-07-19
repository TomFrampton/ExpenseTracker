import { Id } from '@aug/common/id';

export interface TransactionCategory {
    id: Id<TransactionCategory>;
    name: string;
    subCategories?: TransactionCategory[];
}