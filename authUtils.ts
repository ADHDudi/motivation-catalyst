export const signInWithGoogle = async (): Promise<any> => {
    if (!window.firebase) {
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
    if (!window.firebase) return;
    try {
        await window.firebase.auth().signOut();
    } catch (error) {
        console.error("Error signing out", error);
        throw error;
    }
};

export const onAuthStateChange = (callback: (user: any) => void) => {
    if (!window.firebase) return () => {};
    return window.firebase.auth().onAuthStateChanged(callback);
};
