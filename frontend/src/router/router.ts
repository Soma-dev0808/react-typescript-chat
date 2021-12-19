import Chat from "../page_components/Chat";
import { SelectRoom, CreateRoom } from "../page_components/Room";

// url paths for this application
export const routePath = {
  signIn: "/",
  signUp: "/sign-up",
  selectRoom: "/select-room",
  createRoom: "/create-room",
  chat: "/chat",
};

interface Routes {
  path: string;
  Component: React.FC<any>;
}

// Routes array which will be rendered
const routes: Routes[] = [
  {
    path: routePath.chat,
    Component: Chat,
  },
  {
    path: routePath.selectRoom,
    Component: SelectRoom,
  },
  {
    path: routePath.createRoom,
    Component: CreateRoom,
  },
];

export default routes;
