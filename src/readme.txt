REPOSITORY
===============

Check out the GIT repository from https://e3media.visualstudio.com/DefaultCollection/_git/HMPPS-CMS
 into : c:\working_git\HMPPS-CMS\



MANUAL SETUP
============

DIRECTORY AND FILES

1) Your folder structure should be as follows:

		c:\working_git\HMPPS-CMS\src\ (.NET source code)
		c:\working_git\HMPPS-CMS\www\ (sitecore directories)



2) Extract Sitecore 8.2 update 4 from T:\Projects\HMPPS\wwwroot_cms.zip into the www directory. This is an archive of the Azure test CMS site as of 01/09/2017.

  you should have: 
			c:\working_git\HMPPS-CMS\www\



3) open the solution and build the project this will copy the necessary files to the /www directory

4) copy the license.xml file from T:\Sitecore\License\E3 to the /www/App_Data folder


----------------------------


IIS SETUP

1) create a new site in IIS called HMPPS-CMS (name of your choice)

2) set the root to c:\working_git\HMPPS-CMS\www

3) set the host to hmpps.localhost, add the HTTPS binding. right click on the website -> edit permissions -> security -> 
add "iis apppool\hmpps-cms" as a user with modify permissions. Update the anonymous authentication to use the App pool identity.

4) set the app pool to .Net 4, integrated pipeline mode, use app Pool identity (64 bit)

5) edit your hosts file to include: 127.0.0.1	hmpps.localhost

6) add a virtual directory "hmppsAssets" pointing to C:\working_git\HMPPS-CMS\hmppsAssets


----------------------------


SITECORE

Access Sitecore at http://hmpps.localhost/sitecore
Request an individual username and password from a Sitecore administrator in the project team




----------------------------


FE BUILD



Open cmd as admin in c:\working_git\HMPPS-CMS\

Run these commands in order:

npm install yarn

yarn install

yarn dev

yarn build