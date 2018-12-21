<?php
/**
 * @copyright Copyright (c) 2016, ownCloud, Inc.
 *
 * @author Bart Visscher <bartv@thisnet.nl>
 * @author Björn Schießle <bjoern@schiessle.org>
 * @author Joas Schilling <coding@schilljs.com>
 * @author Jörn Friedrich Dreyer <jfd@butonic.de>
 * @author Lukas Reschke <lukas@statuscode.ch>
 * @author Morris Jobke <hey@morrisjobke.de>
 * @author Robin Appelman <robin@icewind.nl>
 * @author Robin McCorkell <robin@mccorkell.me.uk>
 * @author Sam Tuke <mail@samtuke.com>
 * @author Vincent Petry <pvince81@owncloud.com>
 *
 * @license AGPL-3.0
 *
 * This code is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License, version 3,
 * as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License, version 3,
 * along with this program.  If not, see <http://www.gnu.org/licenses/>
 *
 */

/**
 * This class contains all hooks.
 */

namespace OCA\Files_Versions;

class Hooks {

	public static function connectHooks() {
		// Listen to write signals
		\OCP\Util::connectHook('OC_Filesystem', 'write', Hooks::class, 'write_hook');
		// Listen to delete and rename signals
		\OCP\Util::connectHook('OC_Filesystem', 'post_delete', Hooks::class, 'remove_hook');
		\OCP\Util::connectHook('OC_Filesystem', 'delete', Hooks::class, 'pre_remove_hook');
		\OCP\Util::connectHook('OC_Filesystem', 'post_rename', Hooks::class, 'rename_hook');
		\OCP\Util::connectHook('OC_Filesystem', 'post_copy', Hooks::class, 'copy_hook');
		\OCP\Util::connectHook('OC_Filesystem', 'rename', Hooks::class, 'pre_renameOrCopy_hook');
		\OCP\Util::connectHook('OC_Filesystem', 'copy', Hooks::class, 'pre_renameOrCopy_hook');

		$eventDispatcher = \OC::$server->getEventDispatcher();
		$eventDispatcher->addListener('OCA\Files::loadAdditionalScripts', [Hooks::class, 'onLoadFilesAppScripts']);
	}

	/**
	 * listen to write event.
	 */
	public static function write_hook( $params ) {
		$path = $params[\OC\Files\Filesystem::signal_param_path];
		if($path !== '') {
			Storage::store($path);
		}
	}


	/**
	 * Erase versions of deleted file
	 * @param array $params
	 *
	 * This function is connected to the delete signal of OC_Filesystem
	 * cleanup the versions directory if the actual file gets deleted
	 */
	public static function remove_hook($params) {
		$path = $params[\OC\Files\Filesystem::signal_param_path];
		if($path !== '') {
			Storage::delete($path);
		}
	}

	/**
	 * mark file as "deleted" so that we can clean up the versions if the file is gone
	 * @param array $params
	 */
	public static function pre_remove_hook($params) {
		$path = $params[\OC\Files\Filesystem::signal_param_path];
			if($path !== '') {
				Storage::markDeletedFile($path);
			}
	}

	/**
	 * rename/move versions of renamed/moved files
	 * @param array $params array with oldpath and newpath
	 *
	 * This function is connected to the rename signal of OC_Filesystem and adjust the name and location
	 * of the stored versions along the actual file
	 */
	public static function rename_hook($params) {
		$oldpath = $params['oldpath'];
		$newpath = $params['newpath'];
		if($oldpath !== '' && $newpath !== '') {
			Storage::renameOrCopy($oldpath, $newpath, 'rename');
		}
	}

	/**
	 * copy versions of copied files
	 * @param array $params array with oldpath and newpath
	 *
	 * This function is connected to the copy signal of OC_Filesystem and copies the
	 * the stored versions to the new location
	 */
	public static function copy_hook($params) {
		$oldpath = $params['oldpath'];
		$newpath = $params['newpath'];
		if($oldpath !== '' && $newpath !== '') {
			Storage::renameOrCopy($oldpath, $newpath, 'copy');
		}
	}

	/**
	 * Remember owner and the owner path of the source file.
	 * If the file already exists, then it was a upload of a existing file
	 * over the web interface and we call Storage::store() directly
	 *
	 * @param array $params array with oldpath and newpath
	 *
	 */
	public static function pre_renameOrCopy_hook($params) {
		// if we rename a movable mount point, then the versions don't have
		// to be renamed
		$absOldPath = \OC\Files\Filesystem::normalizePath('/' . \OCP\User::getUser() . '/files' . $params['oldpath']);
		$manager = \OC\Files\Filesystem::getMountManager();
		$mount = $manager->find($absOldPath);
		$internalPath = $mount->getInternalPath($absOldPath);
		if ($internalPath === '' and $mount instanceof \OC\Files\Mount\MoveableMount) {
			return;
		}

		$view = new \OC\Files\View(\OCP\User::getUser() . '/files');
		if ($view->file_exists($params['newpath'])) {
			Storage::store($params['newpath']);
		} else {
			Storage::setSourcePathAndUser($params['oldpath']);
		}
	}

	/**
	 * Load additional scripts when the files app is visible
	 */
	public static function onLoadFilesAppScripts() {
		\OCP\Util::addScript('files_versions', 'merged');
	}
}
