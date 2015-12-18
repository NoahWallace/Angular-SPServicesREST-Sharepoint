angular.module('SPServicesREST', [])
    .service('SPRESTItemServices', ['$q', '$http', 'SPRESTListServices', function ($q, $http, SPRESTListServices) {
        return {
            getItems: function (params) {
                var url;
                if (params.caml) {
                    url = params.siteUrl + "/_api/web/lists/GetByTitle('" + params.listName + "')/GetItems";
                }
                else { url = params.siteUrl + "/_api/web/lists/GetByTitle('" + params.listName + "')/Items"; }

                var filters = [];
                if (params.filters) {
                    for (var key in params.filters) {
                        var val = params.filters[key];
                        if (angular.isArray(val)) {
                            val = val.join();
                        }
                        filters.push("&$" + key + "=");
                        filters.push(val);
                    }
                }
                url += '?' + filters.join("");
                var xreq = {
                    method: 'GET',
                    url: url,
                    headers: { "Accept": "application/json;odata=verbose" }
                };
                if (params.caml) {
                    xreq.data = {
                        "query": {
                            "__metadata": {
                                "type": "SP.CamlQuery"
                            },
                            "ViewXml": params.caml
                        }
                    }
                    xreq.method = 'POST';

                    xreq.headers["Content-Type"] = "application/json; odata=verbose"
                }
                var defered = $q.defer();
                this.getContextInfo(params.siteUrl).then(
                    function (res) {
                        xreq.headers['X-RequestDigest'] = res.d.GetContextWebInformation.FormDigestValue

                        $http(xreq).success(function (data) {
                            defered.resolve(data.d.results);
                        }).error(function (err) {
                            defered.reject(err);
                        });
                    })
                return defered.promise;
            },
            getContextInfo: function (url) {
                var defer = $q.defer();
                var reqUrl = url + '/_api/contextinfo';
                var xreq = {
                    method: 'POST',
                    url: reqUrl,
                    headers: { "Accept": "application/json;odata=verbose" }
                };
                $http(xreq).success(function (data) {
                    defer.resolve(data);
                }).error(function (err) {
                    defer.reject(err);
                });
                return defer.promise;
            },
            createItem: function (params) {
                var deferrd = $q.defer();
                if (params.siteUrl && params.listName && params.item) {

                    $q.all([
                        this.getContextInfo(params.siteUrl),
                        SPRESTListServices.getList({
                            'siteUrl': params.siteUrl,
                            'listName': params.listName
                        })
                    ]).then(function (data) {
                        //write the code to create list item
                        var requestDigest = data[0].d.GetContextWebInformation.FormDigestValue;
                        var metadata = data[1].ListItemEntityTypeFullName;
                        var dataObj = { '__metadata': { 'type': metadata } };
                        $.each(params.item, function (key, value) {
                            dataObj[key] = value;
                        });
                        var url = params.siteUrl + "/_api/web/lists/GetByTitle('" + params.listName + "')/Items";
                        var xreq = {
                            url: url,
                            headers: { "Accept": "application/json;odata=verbose", "X-RequestDigest": requestDigest, "Content-Type": "application/json; odata=verbose" },
                        };
                        xreq.data = dataObj;
                        xreq.method = 'POST';
                        $http(xreq).success(function (result) {
                            deferrd.resolve(result);
                        }).error(function (err) {
                            deferrd.reject(err);
                        });

                    });
                }
                return deferrd.promise;
            }

        }
    }])
    .service('SPRESTListServices', function ($q, $http) {
        return {
            getList: function (params) {
                var defered = $q.defer();
                $http({
                    method: 'GET',
                    url: params.siteUrl + "/_api/web/lists/GetByTitle('" + params.listName + "')",
                    headers: { "Accept": "application/json;odata=verbose" }
                }).success(function (data) {
                    defered.resolve(data.d);
                }).error(function (err) {
                    defered.reject(err);
                });
                return defered.promise;
            },
            getField: function (params) {
                var defered = $q.defer();
                $http({
                    method: 'GET',
                    url: params.siteUrl + "/_api/web/lists/GetByTitle('" + params.listName + "')/fields('" + params.GUID + "')",
                    headers: { "Accept": "application/json;odata=verbose" }
                }).success(function (data) {
                    defered.resolve(data.d);
                }).error(function (err) {
                    defered.reject(err);
                });
                return defered.promise;

            },
            getFields: function (params) {
                var defered = $q.defer();
                $http({
                    method: 'GET',
                    url: params.siteUrl + "/_api/web/lists/GetByTitle('" + params.listName + "')/fields",
                    headers: { "Accept": "application/json;odata=verbose" }
                }).success(function (data) {
                    defered.resolve(data.d);
                }).error(function (err) {
                    defered.reject(err);
                });
                return defered.promise;

            }

        };

    })
    .service('SPRESTUserServices', function ($q, $http) {
        return {
            getCurrentUser: function (params) {
                var defered = $q.defer();
                $http({
                    method: 'GET',
                    url: params.siteUrl + "/_api/web/CurrentUser",
                    headers: { "Accept": "application/json;odata=verbose" }
                }).success(function (data) {
                    defered.resolve(data.d);
                }).error(function (err) {
                    defered.reject(err);
                });
                return defered.promise;

            }
        };

    });
