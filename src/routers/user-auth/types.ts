

export interface UserLoginRequest {
	email: string;
	password: string;
}


export interface UserProfile {
	userId: string;
	email: string;
	username: string;
	password: string;
	role: string;
	createdAt: Date;
	updatedAt: Date;
}


export interface UserLoginResponse {
	user: UserProfile;
	token: string;
	refreshToken: string;
}