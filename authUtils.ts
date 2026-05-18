const isFirebaseReady = () => window.firebase?.apps?.length > 0;

export const signInWithGoogle = async (): Promise<any> => {
    if (!isFirebaseReady()) {
        console.error('Firebase not initialized');
        return null;
    }
    
    try {
        const provider = new window.firebase.auth.GoogleAuthProvider();
        const result = await window.firebase.auth().signInWithPopup(provider);
        return result.user;
    } catch (error) {
        console.error("Error signing in with Google", error);
        throw error;
    }
};

export const signOutUser = async (): Promise<void> => {
    if (!isFirebaseReady()) return;
    try {
        await window.firebase.auth().signOut();
    } catch (error) {
        console.error("Error signing out", error);
        throw error;
    }
};

export const onAuthStateChange = (callback: (user: any) => void) => {
    if (!isFirebaseReady()) return () => {};
    return window.firebase.auth().onAuthStateChanged(callback);
};

// Email-based auth functions throw on failure (rather than returning silently)
// so calling code can surface specific error messages to the user.

/** Sign in an existing user with email + password. Throws on wrong credentials. */
export const signInWithEmail = async (email: string, password: string): Promise<any> => {
    if (!isFirebaseReady()) throw new Error('Firebase not initialized');
    try {
        const result = await window.firebase.auth().signInWithEmailAndPassword(email, password);
        return result.user;
    } catch (error) {
        console.error('Error signing in with email', error);
        throw error;
    }
};

/** Register a new user with email + password. Throws on duplicate / weak password. */
export const signUpWithEmail = async (email: string, password: string): Promise<any> => {
    if (!isFirebaseReady()) throw new Error('Firebase not initialized');
    try {
        const result = await window.firebase.auth().createUserWithEmailAndPassword(email, password);
        return result.user;
    } catch (error) {
        console.error('Error signing up with email', error);
        throw error;
    }
};

/** Send a password-reset email. Throws if email is not registered. */
export const sendPasswordReset = async (email: string): Promise<void> => {
    if (!isFirebaseReady()) throw new Error('Firebase not initialized');
    try {
        await window.firebase.auth().sendPasswordResetEmail(email);
    } catch (error) {
        console.error('Error sending password reset', error);
        throw error;
    }
};
