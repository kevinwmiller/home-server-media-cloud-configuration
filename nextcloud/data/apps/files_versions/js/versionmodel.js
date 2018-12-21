/*
 * Copyright (c) 2015
 *
 * This file is licensed under the Affero General Public License version 3
 * or later.
 *
 * See the COPYING-README file.
 *
 */

/* global moment */

(function () {
	/**
	 * @memberof OCA.Versions
	 */
	var VersionModel = OC.Backbone.Model.extend({
		sync: OC.Backbone.davSync,

		davProperties: {
			'size': '{DAV:}getcontentlength',
			'mimetype': '{DAV:}getcontenttype',
			'timestamp': '{DAV:}getlastmodified',
		},

		/**
		 * Restores the original file to this revision
		 */
		revert: function (options) {
			options = options ? _.clone(options) : {};
			var model = this;

			var client = this.get('client');

			return client.move('/versions/' + this.get('fileId') + '/' + this.get('id'), '/restore/target', true)
				.done(function () {
					if (options.success) {
						options.success.call(options.context, model, {}, options);
					}
					model.trigger('revert', model, options);
				})
				.fail(function () {
					if (options.error) {
						options.error.call(options.context, model, {}, options);
					}
					model.trigger('error', model, {}, options);
				});
		},

		getFullPath: function () {
			return this.get('fullPath');
		},

		getPreviewUrl: function () {
			var url = OC.generateUrl('/apps/files_versions/preview');
			var params = {
				file: this.get('fullPath'),
				version: this.get('timestamp')
			};
			return url + '?' + OC.buildQueryString(params);
		},

		getDownloadUrl: function () {
			return OC.linkToRemoteBase('dav') + '/versions/' + this.get('user') + '/versions/' + this.get('fileId') + '/' + this.get('id');
		}
	});

	OCA.Versions = OCA.Versions || {};

	OCA.Versions.VersionModel = VersionModel;
})();

