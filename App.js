import MainPage from "./pages/mainPage.js";
import { initRouter } from "./utils/router.js";

export default function App({ $target }) {
  this.state = {
    postId: "new",
    post: {
      title: "",
      content: "",
    },
    isEditor: false,
  };

  const mainPage = new MainPage({
    $target,
    initialState: this.state,
  });

  this.route = () => {
    $target.innerHTML = "";
    const { pathname } = window.location;

    if (pathname === "/") {
      mainPage.init(null);
    } else if (pathname.indexOf("/documents/") === 0) {
      const [, , postId] = pathname.split("/");
      mainPage.init(postId);
    }
  };
  this.route();

  initRouter(() => this.route());
  window.addEventListener("popstate", () => this.route());
}
