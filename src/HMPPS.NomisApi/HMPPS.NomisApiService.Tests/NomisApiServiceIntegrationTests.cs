using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using HMPPS.ErrorReporting;

namespace HMPPS.NomisApiService.Tests
{
    [TestClass]
    public class NomisApiServiceIntegrationTests
    {
        [TestMethod]
        public void NomisApiService_GetPrisonerAccounts()
        {
            // PrisonId: BMI,  PrisonerId: A3577AE
            // JSON response expected: { "spends": 20637, "cash": 38763,"savings": 5000 }

            var nomisApiService = CreateNomisApiService();
            var accounts = nomisApiService.GetPrisonerAccounts("LEI", "A3577AE");

            Assert.IsNotNull(accounts, "Accounts are null, the Nomis service may be unavailable");
            Assert.IsInstanceOfType(accounts.Spends, typeof(decimal), "Spends is not a decimal");
            Assert.IsInstanceOfType(accounts.Cash, typeof(decimal), "Cash is not a decimal");
            Assert.IsInstanceOfType(accounts.Savings, typeof(decimal), "Savings is not a decimal");

        }

        [TestMethod]
        public void NomisApiService_GetPrisonerAccounts_InvalidPrisonId()
        {
            // PrisonerId: A3577AEx
            // Null accounts expected: 
            var nomisApiService = CreateNomisApiService();
            Assert.IsNull(nomisApiService.GetPrisonerAccounts("LEIx", "A3577AEx"), "Null accounts expected for an invalid prison");
        }

        [TestMethod]
        public void NomisApiService_GetPrisonerAccounts_InvalidPrisonerId()
        {
            // PrisonerId: A3577AEx
            // Null accounts expected: 
            var nomisApiService = CreateNomisApiService();
            Assert.IsNull(nomisApiService.GetPrisonerAccounts("LEI", "A3577AEx"), "Null accounts expected for an invalid prisoner");
        }

        public TestContext TestContext { get; set; }

        private static TestContext _testContext;

        [ClassInitialize]
        public static void SetupTests(TestContext testContext)
        {
            _testContext = testContext;
        }

        private Services.NomisApiService CreateNomisApiService()
        {
            var nomisApiService = new Services.NomisApiService(new Mock<ILogManager>().Object);
            nomisApiService.ApiBaseUrl = TestContext.Properties["HMPPS.NomisApiService.BaseUrl"].ToString();
            nomisApiService.ClientToken = TestContext.Properties["HMPPS.NomisApiService.ClientToken"].ToString();
            nomisApiService.PrivateKey = TestContext.Properties["HMPPS.NomisApiService.SecretKey"].ToString();
            nomisApiService.InitializeClient();
            return nomisApiService;
        }
    }
}
