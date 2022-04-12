export class TransactionType {
    static get all() { return new TransactionType ('all', 'All'); }
    static get categorised() { return new TransactionType ('categorised', 'Categorised'); }
    static get uncategorised() { return new TransactionType ('uncategorised', 'Uncategorised'); }

    static list() {
        return [this.all, this.categorised, this.uncategorised];
    }

    static fromCode(code: string) {
        return this.list().find(x => x.code == code);
    }

    private constructor(readonly code: string, readonly label: string) {}
}