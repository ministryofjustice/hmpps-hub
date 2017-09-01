define(["sitecore", "/-/speak/v1/experienceprofile/DataProviderHelper.js", "/-/speak/v1/experienceprofile/CintelUtl.js"], function(sc, providerHelper, cintelUtil)
{
  var intelPath = "/intel",
      dataSetProperty = "dataSet";

  var getTypeValue = function(preffered, all)
  {
    if(preffered.Key)
    {
      return { type: preffered.Key, value: preffered.Value };
    } else if(all.length > 0)
    {
      return { type: all[0].Key, value: all[0].Value };
    }

    return null;
  };

  var app = sc.Definitions.App.extend({
    initialized: function()
    {
      var transformers = $.map(
        [
          "default"
        ], function(tableName)
        {
            return { urlKey: intelPath + "/" + tableName + "?", headerValue: tableName };
        });

      providerHelper.setupHeaders(transformers);
      providerHelper.addDefaultTransformerKey();

      this.setupContactDetail();
    },
    
    setEmail: function (textControl, email)
    {
      if (email && email.indexOf("@") > -1)
      {
        cintelUtil.setText(textControl, "", true);
        textControl.viewModel.$el.html('<a href="mailto:' + email + '">' + email + '</a>');
      } else
      {
        cintelUtil.setText(textControl, email, true);
      }
    },

    setupContactDetail: function()
    {
      var getFullAddress = function(data)
      {
        var addressParts = [
          data.streetLine1,
          data.streetLine2,
          data.streetLine3,
          data.streetLine4,
          data.city,
          data.country,
          data.postalCode
        ];

        addressParts = $.map(addressParts, function(val) { return val ? val : null; });
        return addressParts.join(", ");
      };

      providerHelper.initProvider(this.ContactDetailsDataProvider, "", sc.Contact.baseUrl, this.DetailsTabMessageBar);
      providerHelper.getData(
        this.ContactDetailsDataProvider,
        $.proxy(function(jsonData)
        {
          this.EmailColumnDataRepeater.viewModel.addData(jsonData.emailAddresses);
          this.PhoneColumnDataRepeater.viewModel.addData(jsonData.phoneNumbers);
          this.AddressColumnDataRepeater.viewModel.addData(jsonData.addresses);

          this.ContactDetailsDataProvider.set(dataSetProperty, jsonData);

          cintelUtil.setText(this.FirstNameValue, jsonData.firstName, false);
          cintelUtil.setText(this.MiddleNameValue, jsonData.middleName, false);
          cintelUtil.setText(this.LastNameValue, jsonData.surName, false);
          
          cintelUtil.setTitle(this.FirstNameValue, jsonData.firstName);
          cintelUtil.setTitle(this.MiddleNameValue, jsonData.middleName);
          cintelUtil.setTitle(this.LastNameValue, jsonData.surName);

          cintelUtil.setText(this.TitleValue, jsonData.jobTitle, false);

          cintelUtil.setText(this.GenderValue, jsonData.gender, false);
          cintelUtil.setText(this.BirthdayValue, jsonData.formattedBirthDate, false);

          var dataSet = this.ContactDetailsDataProvider.get(dataSetProperty);

          var email = getTypeValue(jsonData.preferredEmailAddress, dataSet.emailAddresses);
          if(email)
          {
            cintelUtil.setText(this.PrimeEmailType, email.type, true);
            this.setEmail(this.PrimeEmailValue, email.value.SmtpAddress);
            cintelUtil.setTitle(this.PrimeEmailValue, email.value.SmtpAddress);
          }

          var phone = getTypeValue(jsonData.preferredPhoneNumber, dataSet.phoneNumbers);
          if(phone)
          {
            cintelUtil.setText(this.PrimePhoneType, phone.type, true);
            cintelUtil.setText(this.PrimePhoneValue, cintelUtil.getFullTelephone(phone.value), true);
          }

          var address = getTypeValue(jsonData.preferredAddress, dataSet.addresses);
          if(address)
          {
            cintelUtil.setText(this.PrimeAddressType, address.type, true);
            cintelUtil.setText(this.PrimeAddressValue, getFullAddress(address.value), true);
          }
        }, this)
      );

      this.EmailColumnDataRepeater.on("subAppLoaded", function(args)
      {
        cintelUtil.setText(args.app.Type, args.data.Key, true);
        this.setEmail(args.app.Value, args.data.Value.SmtpAddress);
        cintelUtil.setTitle(args.app.Value, args.data.Value.SmtpAddress);
      }, this);

      this.PhoneColumnDataRepeater.on("subAppLoaded", function(args)
      {
        cintelUtil.setText(args.app.Type, args.data.Key, true);
        cintelUtil.setText(args.app.Value, cintelUtil.getFullTelephone(args.data.Value), true);
      }, this);

      this.AddressColumnDataRepeater.on("subAppLoaded", function(args)
      {
        cintelUtil.setText(args.app.Type, args.data.Key, true);
        cintelUtil.setText(args.app.Value, getFullAddress(args.data.Value), true);
      }, this);
    }
  });
  return app;
});