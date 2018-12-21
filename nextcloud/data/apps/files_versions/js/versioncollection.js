/*
 * Copyright (c) 2015
 *
 * This file is licensed under the Affero General Public License version 3
 * or later.
 *
 * See the COPYING-README file.
 *
 */

(function () {
	/**
	 * @memberof OCA.Versions
	 */
	var VersionCollection = OC.Backbone.Collection.extend({
		model: OCA.Versions.VersionModel,
		sync: OC.Backbone.davSync,

		/**
		 * @var OCA.Files.FileInfoModel
		 */
		_fileInfo: null,

		_currentUser: null,

		_client: null,

		setFileInfo: function (fileInfo) {
			this._fileInfo = fileInfo;
		},

		getFileInfo: function () {
			return this._fileInfo;
		},

		setCurrentUser: function(user) {
			this._currentUser = user;
		},

		getCurrentUser: function() {
			return this._currentUser || OC.getCurrentUser().uid;
		},

		setClient: function(client) {
			this._client = client;
		},

		getClient: function() {
			return this._client || new OC.Files.Client({
				host: OC.getHost(),
				root: OC.linkToRemoteBase('dav') + '/versions/' + this.getCurrentUser(),
				useHTTPS: OC.getProtocol() === 'https'
			});
		},

		url: function () {
			return OC.linkToRemoteBase('dav') + '/versions/' + this.getCurrentUser() + '/versions/' + this._fileInfo.get('id');
		},

		parse: function(result) {
			var fullPath = this._fileInfo.getFullPath();
			var fileId = this._fileInfo.get('id');
			var name = this._fileInfo.get('name');
			var user = this.getCurrentUser();
			var client = this.getClient();
			return _.map(result, function(version) {
				version.fullPath = fullPath;
				version.fileId = fileId;
				version.name = name;
				version.timestamp = parseInt(moment(new Date(version.timestamp)).format('X'), 10);
				version.id = parseInt(OC.basename(version.href), 10);
				version.size = parseInt(version.size, 10);
				version.user = user;
				version.client = client;
				return version;
			});
		}
	});

	OCA.Versions = OCA.Versions || {};

	OCA.Versions.VersionCollection = VersionCollection;
})();

