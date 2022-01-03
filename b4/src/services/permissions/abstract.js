/**
 * @typedef {typeof import ('./constants').PERMISSIONS_STATUS} PermissionStatusEnum
 * @typedef {keyof PermissionStatusEnum} PermissionState
 */

/**
 * @template {PermissionState} S
 * @typedef {Object} PermissionStatus
 * @property {S} status
 * @property {{(handler:(state:S) => any):void}} subscribe
 */

/** class for handling requests for microphone device permissions  */
export default class AbstractPermissionsService {
  /**
   * init microphone permission request
   * @template {PermissionState} S
   * @returns {Promise<PermissionStatus<S>>}
   */
  init() {
    return Promise.reject(`Not implemented!`);
  }

  /**
   * prompt for permissions(?)
   * @template {PermissionState} S
   * @returns {Promise<S>}
   */
  prompt() {
    return Promise.reject(`Not implemented!`);
  }

  /**
   * When microphone permission was denied, learners may be reminded to re-engage with permissions.
   * To enable that, this method would return true
   * @returns {boolean}
   */
  resetOnDeniedPermission() {
    throw new Error(`Not implemented!`);
  }
}
