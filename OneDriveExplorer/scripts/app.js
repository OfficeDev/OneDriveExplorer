/// <reference path="services/office365/settings/settings.js" />
/// <reference path="services/office365/scripts/o365discovery.js" />
/// <reference path="services/office365/scripts/sharepoint.js" />

angular.module('MyFiles', [], function ($compileProvider) {
})

.controller('AppCtrl', function ($scope) {
    $scope.authContext;
    $scope.discoveryContext;
    $scope.capabilities;
    $scope.userName;
    $scope.userLoggedIn = false;
    $scope.contentLoaded = false;
    $('#loading').hide();

    // Authentication
    $scope.login = function () {
        if (!$scope.authContext) {
            $scope.authContext = new O365Auth.Context();
        }
        
        if (!$scope.discoveryContext) {
            $scope.discoveryContext = new O365Discovery.Context();
        }
        
        $scope.discoveryContext.services($scope.authContext.getAccessTokenFn('Microsoft.SharePoint')).then((function (value) {
            $scope.capabilities = value;
            $scope.userLoggedIn = true;

            $scope.myFiles = [];
            $scope.myFiles.name = "My Files";
            $scope.myFilesStack = [$scope.myFiles];
            $scope.topLevelStack = true;

            $scope.getMyFiles();
            $scope.getCurrentUser();
            $scope.$apply();
        }).bind(this), function (error) {
            console.log(JSON.stringify(error));
        });
    };

    // Get currently logged in user
    $scope.getCurrentUser = function () {
        $scope.authContext.getIdToken("https://outlook.office365.com/")
       .then((function (token) {
           $scope.authToken = token;
           $scope.userName = token.givenName + ' ' + token.familyName;
       }).bind(this), function (reason) {
           console.og(reason.message);
       });
    }

    // Logout
    $scope.logout = function () {
        if (!$scope.authContext) {
            $scope.authContext = new AadAuth.Context();
        }

        $scope.authContext.logOut();
        $scope.userLoggedIn = false;
    };

    $scope.getMyFiles = function () {
        var filesCapability;
        $scope.contentLoaded = false;
        $('#loading').show();
        $scope.capabilities.forEach(function (v, i, a) {
            if (v.capability === 'MyFiles') {
                filesCapability = v;
            }
        });

        var sharePoint = new Microsoft.CoreServices.SharePointClient(
            filesCapability.resourceId + '/_api/v1.0/me/',
            $scope.authContext.getAccessTokenFn(filesCapability.resourceId)
        );
        sharePoint.files.getItems().fetch().then(function (v) {
            v.currentPage.forEach(function (o) {
                $scope.addFileItem(
                    $scope.myFiles,
                    o._name, getFileIconName(o._type, o._name),
                    o
                );
            });

            $scope.topLevelStack = true; 
            $scope.contentLoaded = true;
            $('#loading').hide();
            $scope.$apply();
        });
    }

    $scope.addFileItem = function(targetFolder, filePath, type, objectToCache) {
        // Recursively build the hierarchy

        if (filePath.indexOf('/') == -1) {
            // Leaf node, Just add to current scope
            var chArr = [];
            chArr.name = filePath;

            targetFolder.push({
                name: filePath,
                type: type,
                children: type == 'folder' ? createEmptyArray(filePath) : null,
                objCache : type != 'folder' ? objectToCache : null
            });
        } else {
            // Non leaf node
            var hierarchy = filePath.split('/');
            var fileItemFound = _.findWhere(targetFolder, { name: hierarchy[0] });

            if (fileItemFound) {
                hierarchy.splice(0, 1); // Item already found, We dont need this
                $scope.addFileItem(fileItemFound.children, hierarchy.join('/'), type);
            } else {
                var name = hierarchy.splice(0, 1)[0];
                targetFolder.push({
                    name: name,
                    type: 'folder',
                    children: createEmptyArray(name)
                });
                $scope.addFileItem(targetFolder[targetFolder.length - 1].children, hierarchy.join('/'), type);
            }
        }
    }

    $scope.navigateInto = function (index) {
        var frame = $scope.myFilesStack[$scope.myFilesStack.length - 1][index];

        if (frame.children != null) {
            $scope.myFilesStack.push(frame.children);
            $scope.topLevelStack = false;
        }
    }

    $scope.navigateBack = function () {
        $scope.myFilesStack.pop();
        if ($scope.myFilesStack.length == 1) $scope.topLevelStack = true;
    }
});

function createEmptyArray(name) {
    var arr = [];
    arr.name = name;
    return arr;
}

function getFileIconName(type, name) {
    if (type.indexOf('Folder') != -1) {
        return 'folder';
    } else if (type.indexOf('File') != -1) {
        return name.substring(name.indexOf('.') + 1);
    }

    return 'docx'; // Default
}