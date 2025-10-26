import { Action, accessRights } from '@/config/authAccess';


// export const hasAccess = (scopes: string[], object: string, action: Action): boolean => {
// 	return scopes.some(scope => accessRights[scope] && accessRights[scope][object] && accessRights[scope][object].includes(action));
// }

export const hasAccess = (scopes: string[], area: string, object: string, action: Action): boolean => {	    
	return scopes.some(scope => accessRights[`${area}_${scope}`] && accessRights[`${area}_${scope}`][object] && accessRights[`${area}_${scope}`][object].includes(action));
}