using Sitecore.Diagnostics;
using System.Collections.Generic;

namespace FS.MediaLibrary.CloudStorage.Configuration
{
    public class LocationConfiguration
    {
        public IList<Location> Locations { get; private set; }

        public LocationConfiguration()
        {
            this.Locations = (IList<Location>)new List<Location>();
        }

        public virtual void AddLocation(Location location)
        {
            Assert.ArgumentNotNull((object)location, "location");
            this.Locations.Add(location);
            Log.Info("!!!!!!!!!!!!!!!!!!!!!!!!!1 Location added: " + location.MediaFolder + "," + location.ContainerName, this);
        }
    }

    public class Location
    {
        public string ContainerName { get; set; }
        public string MediaFolder { get; set; }
    }
}