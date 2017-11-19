/* global firebase */
/* global firebaseui */

import ca from '../constants/auth';
export default (function(ns) {

    var ui_;

    /**
     * just set up firebase with credentials
     */
    ns.init = function() {

        firebase.initializeApp(ca.config);
    };

    /*
     * listening for changes in auth state
     */
    ns.listen = function(pack, func) {


        // Listen to change in auth state so it displays the correct UI for when
        // the user is signed in or not.
        firebase.auth().onAuthStateChanged(function(user) {
            // The observer is also triggered when the user's token has expired and is
            // automatically refreshed. In that case, the user hasn't changed so we should
            // not update the UI.
            
            if (user && pack.user && user.uid === pack.user.uid) {
                return;
            }
            func(user);
        });
    };


    /**
     * do an auth
     * @param {Element} elem where to do the sign in
     * @param {function} func what to do on successful sign in
     * @return {object} ui
     */
    ns.start = function(elem, func) {
        // FirebaseUI config.
        
        var uiConfig = {
            callbacks: {
                signInSuccess: function(currentUser, credential, redirectUrl) {
                    func(currentUser, credential, redirectUrl);
                    return false;
                }
            },
            signInFlow: 'popup',
            signInOptions: [
                firebase.auth.GoogleAuthProvider.PROVIDER_ID 
            ],
            // Terms of service url.
            tosUrl: ca.tos
        };

        // Initialize the FirebaseUI Widget using Firebase.
        ui_ = new firebaseui.auth.AuthUI(firebase.auth());
        // The start method will wait until the DOM is loaded.
        ui_.start('#' + elem.id, uiConfig);
        return ui_;

    };
    return ns;
})({});
