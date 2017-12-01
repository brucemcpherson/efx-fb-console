export default {
    
    actions: {
        REQUEST_TRANSACTIONS:'REQUEST_TRANSACTIONS',
        
        RANGE_START:'RANGE_START',
        RANGE_FINISH:'RANGE_FINISH',
        RANGE_PERIOD:'RANGE_PERIOD',
        GENERATE_SLOTS:'GENERATE_SLOTS',
        
	    AUTH_SIGNOUT:'AUTH_SIGNOUT',
	    AUTH_SIGNIN:'AUTH_SIGNIN',
        AUTH_USER:'AUTH_USER',
        
        ACCOUNT_LOCALUPDATE:'ACCOUNT_LOCALUPDATE',
        
        ACCOUNTS_SELECTED:'ACCOUNTS_SELECTED',
        BOSSES_SELECTED:'BOSSES_SELECTED',
        KEYS_SELECTED:'KEYS_SELECTED',
                
        FETCH_ACCOUNTS:'FETCH_ACCOUNTS',
        SELECT_ROW_ACCOUNT:'SELECT_ROW_ACCOUNT',
        COUNTER_ACCOUNTS:'COUNTER_ACCOUNTS',
        ADD_ACCOUNT:'ADD_ACCOUNT',
        REMOVE_ACCOUNT:'REMOVE_ACCOUNT',
        UPDATE_ACCOUNT:'UPDATE_ACCOUNT',
        ADD_BOSS:'ADD_BOSS',
	    FETCH_BOSSES:'FETCH_BOSSES',        
        FETCH_STATS:'FETCH_STATS',
	    REMOVE_BOSS:'REMOVE_BOSS',

        ACCOUNTS_RESULT_CLEAR:"ACCOUNTS_RESULT_CLEAR",
        STATS_RESULT_CLEAR:"STATS_RESULT_CLEAR",
        
        T_WRITE_ITEM:'T_WRITE_ITEM',
        T_READ_ITEM:'T_READ_ITEM',
        T_REMOVE_ITEM:'T_REMOVE_ITEM',
        T_WRITE_SHARED:'T_WRITE_SHARED',
        T_UPDATE_ITEM:'T_UPDATE_ITEM',
        T_MAKE_EVERYTHING:'T_MAKE_EVERYTHING',
        T_RESULT:'T_RESULT',
        T_GENERATE_KEYS: 'T_GENERATE_KEYS', 
	    T_PING:'T_PING',
	    T_INFO:'T_INFO',
        T_VALIDATE_KEY:'T_VALIDATE_KEY',
        T_FETCH_QUOTAS:'T_FETCH_QUOTAS',
        T_REGISTER_ALIAS:'T_REGISTER_ALIAS',
        T_AJSON_KEYS:'T_AJSON_KEYS',
        T_GET_SOMEKEYS:'T_GET_SOMEKEYS',
        T_WRITE_JSON_ITEM:'T_WRITE_JSON_ITEM',
        T_READ_JSON_ITEM:'T_READ_JSON_ITEM',
        T_UPDATE_JSON_ITEM:'T_UPDATE_JSON_ITEM',
        T_REMOVE_JSON_ITEM:'T_REMOVE_JSON_ITEM',
        M_SELECTED_VALUE:'M_SELECTED_VALUE',
	    M_DRAWER_OPEN:'M_DRAWER_OPEN'
	    
    },
    status: {
    	AUTH_UNKNOWN: 'AUTH_UNKNOWN',
        AUTH_AWAITING_RESPONSE: 'AUTH_AWAITING_RESPONSE',
        AUTH_LOGGED_IN: 'AUTH_LOGGED_IN',
        AUTH_AWAITING_USER: 'AWAITING_USER'
    },
    values: {
        COUNTER_START:1377,
        BOSS_MINUTES:  60 * 24 * 28     // 28 days
    },
    
    plans: {
        
        a:{
            MAX_ACCOUNTS:3,
            MAX_BOSSES:4,
            name:'free'
        },

        b:{
            MAX_ACCOUNTS:10,
            MAX_BOSSES:8,
            name:'pro'
        },
        
        x:{
            MAX_ACCOUNTS:8,
            MAX_BOSSES:20,
            name:'tutorial'
        }
        
    },
    tutorial: {
        bossLife:60*60*2,      // they last 2 hours
        enough:60*30,          // make sure a key has this time on it before attempting anything
        keyCount:3             // how many to generate
    }
};