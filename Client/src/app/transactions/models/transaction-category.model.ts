import { Id } from '@app/common/id';

export interface TransactionCategory {
    id: Id<TransactionCategory>;
    name: string;
    parentId?: number;
    count?: number;
}