export interface CommonSelect {
	value : string | number;
	label : string;
	}

export interface QueryPager {
	page?: number,
	pageSize?: number
	}

// Internal pager state that guarantees non-undefined values
export interface PagerState {
	page: number,
	pageSize: number
	}	
export interface Pager {
	page: number,
	pageSize: number,
	total: number,
	}

	export interface SelectedObj {
		showForm: boolean;
		showEdit: boolean;
		showView: boolean;
		showDelete: boolean;
		keys: Record<string, any>;
		primaryKeys: Record<string, any>;
		label: string;
	}	

	export type RelationshipType = "M2M" | "O2M" | "M2O" | "" | undefined;
	export interface ChildObj {
		open: boolean;
		filterKeys: Record<string, any>;
		label: string;
	}				
export interface ISessionUser {
		userId: string;
		email:	string;
		status:	boolean;	
		scope: string[];
	}		
	
	export interface MenuItem {
		key: string;
		label: string;
		scope: string[];
		children?: MenuItem[];
		icon?: React.ComponentType<any>;
	}	

	export interface IFile {
		fileList: { originFileObj: File }[];
	}

	export interface MutationResponse<T> {
		message: string,
		isError: true,
		data: T
	}
	
	export interface ILanguage {
		code: string,
		dir: 'rtl' | 'ltr'
	}

	export interface CustomRoutes {
		key: string;
		path: string;
		component: React.LazyExoticComponent<React.FC<{}>>;
	}

	export type NotificationType = 'success' | 'info' | 'warning' | 'error';