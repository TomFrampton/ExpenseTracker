namespace ExpenseTracker.Api.Models.Transactions
{
    public class AddTransactionCategoryRequest
    {
        public string Name { get; set; }
        public int? ParentId{ get; set; }

        public AddTransactionCategoryRequest(string name, int? parentId = null)
        {
            Name = name;
            ParentId = parentId;
        }
    }
}
