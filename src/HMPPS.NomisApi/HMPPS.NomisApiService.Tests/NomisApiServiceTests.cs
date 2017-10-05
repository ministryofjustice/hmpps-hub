using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Configuration;


namespace HMPPS.NomisApiService.Tests
{
    [TestClass]
    public class NomisApiServiceTests
    {
        [TestMethod]
        public void NomisApiService_GetPrisonerLocationDetails()
        {
            // PrisonerId: A1417AE
            // JSON respornse expected: {"establishment":{"code":"BMI","desc":"BIRMINGHAM (HMP)"}}

            var nomisApiService = CreateNomisApiService();
            var establishment = nomisApiService.GetPrisonerLocationDetails("A1417AE");

            Assert.AreEqual(establishment.Code, "BMI");
            Assert.AreEqual(establishment.Desc, "BIRMINGHAM (HMP)");

        }

        [TestMethod]
        public void NomisApiService_GetPrisonerLocationDetails_InvalidPrisonerId()
        {
            // PrisonerId: A1417AEx
            // Exception expected: 
            var nomisApiService = CreateNomisApiService();
            Assert.ThrowsException<AggregateException>(() => nomisApiService.GetPrisonerLocationDetails("A1417AEx"));
        }


        [TestMethod]
        public void NomisApiService_GetPrisonerAccounts()
        {
            // PrisonId: BMI,  PrisonerId: A1417AE
            // JSON respornse expected: { "spends": 20637, "cash": 38763,"savings": 5000 }

            var nomisApiService = CreateNomisApiService();
            var accounts = nomisApiService.GetPrisonerAccounts("BMI", "A1417AE");

            Assert.AreEqual(accounts.Spends, (decimal)206.37);
            Assert.AreEqual(accounts.Cash, (decimal)641.63);
            Assert.AreEqual(accounts.Savings, (decimal)50.00);

        }

        [TestMethod]
        public void NomisApiService_GetPrisonerAccounts_InvalidPrisonId()
        {
            // PrisonerId: A1417AEx
            // Exception expected: 
            var nomisApiService = CreateNomisApiService();
            Assert.ThrowsException<AggregateException>(() => nomisApiService.GetPrisonerAccounts("BMIx", "A1417AE"));
        }

        [TestMethod]
        public void NomisApiService_GetPrisonerAccounts_InvalidPrisonerId()
        {
            // PrisonerId: A1417AEx
            // Exception expected: 
            var nomisApiService = CreateNomisApiService();
            Assert.ThrowsException<AggregateException>(() => nomisApiService.GetPrisonerAccounts("BMI", "A1417AEx"));
        }

        private HMPPS.NomisApiService.Services.NomisApiService CreateNomisApiService()
        {
            var nomisApiService = new HMPPS.NomisApiService.Services.NomisApiService(false);
            nomisApiService.ApiBaseUrl = ConfigurationManager.AppSettings["HMPPS.NomisApiService.BaseUrl"];
            nomisApiService.ClientToken = ConfigurationManager.AppSettings["HMPPS.NomisApiService.ClientToken"];
            nomisApiService.SecretPkcs8 = ConfigurationManager.AppSettings["HMPPS.NomisApiService.SecretKey"];
            nomisApiService.InitializeClient();
            return nomisApiService;
        }
    }
}
