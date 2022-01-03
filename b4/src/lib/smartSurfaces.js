import * as features from './features';
import { getLocalStorage } from './localStorage';

const LOCALSTORAGE_NAMESPACE = 'SMURFS';
export const HAS_SEEN_REFER_A_FRIEND_MODAL = 'LES.SeenRaF';
export const smartSurfacesLocalStorage = getLocalStorage(LOCALSTORAGE_NAMESPACE);

export const isAllowedReferAFriend = () => (
  Boolean(features.get('is_refer_a_friend')) && smartSurfacesLocalStorage.get(HAS_SEEN_REFER_A_FRIEND_MODAL) === null
);
