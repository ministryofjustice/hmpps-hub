namespace HMPPS.NomisApiService.Models
{
    public class Accounts
    {
        public decimal Spends { get; set; }

        public decimal Cash { get; set; }

        public decimal Savings { get; set; }


        public Accounts(AccountsResponse accountsResponse)
        {
            Spends = (decimal)accountsResponse.Spends / 100;
            Cash = (decimal)accountsResponse.Cash / 100;
            Savings = (decimal)accountsResponse.Savings / 100;
        }

    }
}
