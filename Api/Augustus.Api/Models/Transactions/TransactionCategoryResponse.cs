namespace Augustus.Api.Models.Transactions
{
    public class TransactionCategoryResponse
    {
        public int Id { get; set; }
        public string Name { get; set; }

        /// <summary>
        /// Number of transactions that have been categorised under this category
        /// </summary>
        public int? Count { get; set; }

        public int? ParentId { get; set; }
    }
}
