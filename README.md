# Starter Hybrid Mobile App for accessing OneDrive using Office 365 APIs #

**Table of Contents**

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Configuration](#configuration)
- [Build](#build)
- [License](https://github.com/OfficeDev/OneDriveExplorer/blob/master/LICENSE)

## Overview ##

This sample Cordova application uses Office 365 APIs to demonstrate how to enumerate files stored in OneDrive.

<a name="prerequisites"></a>
## Prerequisites ##

To run this sample, you need:

1. Visual Studio 2013 with Update 3
2. [Multi-Device Hybrid Apps (Preview) Extension](http://www.visualstudio.com/en-us/explore/cordova-vs.aspx)
3. [Office 365 API Tools for Visual Studio 2013](https://visualstudiogallery.msdn.microsoft.com/a15b85e6-69a7-4fdf-adda-a38066bb5155)
4. An Office 365 developer site. If you don't already have one, [join the Office 365 Developer Program and get a free 1 year subscription to Office 365](https://profile.microsoft.com/RegSysProfileCenter/wizardnp.aspx?wizid=14b845d0-938c-45af-b061-f798fbb4d170&lcid=1033)

<a name="configuration"></a>
## Configuration ##

Before you can build and run the app, you need to register the app to consume Office 365 services and install the client libraries. You can do this via the Office 365 API Tools for Visual Studio (which automates the registration process). Be sure to download and install the [Office 365 API tools](http://visualstudiogallery.msdn.microsoft.com/7e947621-ef93-4de7-93d3-d796c43ba34f) from the Visual Studio Gallery and follow these steps.

  1. In the Solution Explorer window, right click on project head - OneDriveExplorer (Multi-Device Hybrid App)
  2. Select Add -> Connected Service.
  3. A Services Manager window will appear. Choose Office 365 and Register your app.
  4. On the sign-in dialog box, enter the user name and password for your Office 365 tenant. We recommend that you use your Office 365 Developer Site. Often, this user name will follow the pattern <your-name>@<tenant-name>.onmicrosoft.com. If you do not have a developer site, you can get a free Developer Site as part of your MSDN Benefits or sign up for a free trial. Be aware that the user must be a Tenant Admin user—but for tenants created as part of an Office 365 Developer Site, this is likely to be the case already. Also developer accounts are usually limited to one sign-in.
  4. After you're signed in, you will see a list of all the services. Initially, no permissions will be selected, as the app is not registered to consume any services yet. 
  5. To register for the services used in this sample, choose the following permissions, and select the Permissions link to set the following permissions:
	 - (My Files) – Enable Read users files
  6. After clicking OK in the Services Manager window, JavaScript client libraries for Office 365 will be added to your project.

<a name="build"></a>
## Build ##

Select Windows-AnyCPU as your build target and press F5 to build and debug. Run the application and sign in with your organizational account to Office 365.
