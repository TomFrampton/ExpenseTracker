namespace Augustus.Api.Models.Transactions
{
    public class UpdateTransactionCategoryRequest
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public UpdateTransactionCategoryRequest(int id, string name)
        {
            Id = id;
            Name = name;
        }
    }
}
