import { useEffect, useState } from "react";
import { auth, db } from "../../utils/firebase";
import { en } from "../../utils/language";

interface UserStatusState {
  isAuth: boolean;
  username: string | null;
}

interface UseAuthState extends UserStatusState {
  isLoading: boolean;
}

const useAuth = (): UseAuthState => {
  const [authInfo, setAuthInfo] = useState<UserStatusState>({
    isAuth: false,
    username: null,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const unlisten = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // set username and isAuth
        const uid: string = user.uid;
        const usernameField = await db.collection(en.USERNAMES).doc(uid).get();
        if (usernameField.exists) {
          const username: string = usernameField.data()!.username;
          setAuthInfo({
            isAuth: true,
            username,
          });
        }
      } else {
        // not authenticated
        setAuthInfo({
          isAuth: false,
          username: null,
        });
      }
      setIsLoading(false);
    });

    return () => unlisten();
  }, []);

  const { isAuth, username } = authInfo;
  return { isAuth, username, isLoading };
};

export default useAuth;
