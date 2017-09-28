using Microsoft.VisualStudio.TestTools.UnitTesting;
using HMPPS.Authentication.Services;
using System;

namespace HMPPS.Authentication.Tests
{
    [TestClass]
    public class NomisApiServiceTests
    {
        [TestMethod]
        public void TNomisApiService_GetPrisonerLocationDetails()
        {
            // PrisonerId: A1417AE
            // JSON respornse expected: {"establishment":{"code":"BMI","desc":"BIRMINGHAM (HMP)"}}

            var nomisApiService = CreateNomisApiService();
            var establishment = nomisApiService.GetPrisonerLocationDetails("A1417AE");

            Assert.AreEqual(establishment.Code, "BMI");
            Assert.AreEqual(establishment.Desc, "BIRMINGHAM (HMP)");

        }

        [TestMethod]
        public void TNomisApiService_GetPrisonerLocationDetails_InvalidPrisonerId()
        {
            // PrisonerId: A1417AEx
            // Exception expected: 
            var nomisApiService = CreateNomisApiService();
            Assert.ThrowsException<AggregateException>(() => nomisApiService.GetPrisonerLocationDetails("A1417AEx"));
        }

        private NomisApiService CreateNomisApiService()
        {
            var nomisApiService = new NomisApiService(false);
            nomisApiService.ApiBaseUrl = "https://noms-api-dev.dsd.io/nomisapi";
            nomisApiService.ClientToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJpYXQiOjE1MDI3ODkxNzUsImV4cCI6MTUzNDI4NzYwMCwiY2xpZW50IjoiUHJpc29uZXIgRXhwZXJpZW5jZSBQbGF0Zm9ybSAoQ01TKSIsImtleSI6Ik1Ga3dFd1lIS29aSXpqMENBUVlJS29aSXpqMERBUWNEUWdBRWFTNjFOcjBhVGw0UTRXbk5mL2twbmpIWXY4RXVva0ZkUVVZVUFFQzAzQ0ZRc2p4SktzYWgyTlhMRHRzQnozYjJzYWFQS3R1anAzMWgyUzVVNXJSaDFBPT0iLCJhY2Nlc3MiOlsiLioiXX0.2Y8iX13tw0-WuNXM7HDhfSvkD7yXsgAByLwXO95fhsdq0ZDtvSIWetDEmrOWCq-G5Muhj67rCK_yZIfJXMk4xA";
            nomisApiService.SecretPkcs8 = "MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgthDfV2dwuWRfVjTunNtPLT/leDfVlf1KFP/l397hNTqhRANCAARpLrU2vRpOXhDhac1/+SmeMdi/wS6iQV1BRhQAQLTcIVCyPEkqxqHY1csO2wHPdvaxpo8q26OnfWHZLlTmtGHU";
            nomisApiService.InitializeClient();
            return nomisApiService;
        }
    }
}
