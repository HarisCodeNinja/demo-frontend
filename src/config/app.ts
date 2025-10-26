import { ILanguage } from "@/interface/common";

const appConfig = {
    BASE_URL: 'http://localhost:8000',
    FILE_PATH: 'http://localhost:8000/public/',
    ENVIRONMENT : 'development',
    PERSIST_STORE_NAME : 'boilerplate',
	CACHE_TOKEN: '3002910e-c28d-45c2-9ce5-edf9b8831724'

}

export const AVAILABLE_LANGUAGES : ILanguage [] = [
	{
		 "code": "en",
		 "dir" : "ltr"
	}
]

export const {ENVIRONMENT, PERSIST_STORE_NAME,BASE_URL, FILE_PATH, CACHE_TOKEN} = appConfig;
export default appConfig;