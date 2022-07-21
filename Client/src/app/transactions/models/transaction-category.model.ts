import { Id } from '@aug/common/id';

export interface TransactionCategory {
    id: Id<TransactionCategory>;
    name: string;
    parentId?: number;
    count?: number;
}