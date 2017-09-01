define(["sitecore"], function (sc) {
  sc.Factories.createBaseComponent({
    name: "ListManagementBreadCrumb",
    base: "BlockBase",
    selector: ".sc-listmanagement-breadcrumb",
    attributes: [
      { name: "prevPage", value: "$el.attr:prevpage" }
    ]
  });
});
