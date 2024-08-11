import DocumentList from "../components/DocumentList.js";
import Editor from "../components/Editor.js";
import { removeItem } from "../utils/storage.js";
import {
  createDocument,
  deleteDocument,
  getAllDocument,
  getDocument,
  updateDocument,
} from "../utils/api.js";
import getChildTitleList from "../utils/getChildTitleList.js";
import getTitleList from "../utils/getTitleList.js";
import { push } from "../utils/router.js";
import DefaultScreen from "../components/DefaultScreen.js";

export default function MainPage({ $target }) {
  const $page = document.createElement("div");
  $page.className = "container";
  const SELECT_TIME = 0;
  this.state = {
    documentList: [],
    postId: "new",
    post: {
      title: "",
      content: "",
    },
    titleList: [],
    childTitleList: [],
    isEditor: false,
    selectedDocument: "",
    isLoading: false,
    isInit: true,
  };

  this.init = async (id) => {
    this.setState({ ...this.state, isEditor: id, postId: id || "new", isInit: true });
    await fetchDocumentList();
    await fetchPost();
  };

  this.setState = (nextState) => {
    this.state = nextState;
    documentList.setState({
      documentList: this.state.documentList,
      selectedDocument: this.state.selectedDocument,
    });
    editor.setState({
      title: this.state.post.title,
      content: this.state.post.content,
      isEditor: this.state.isEditor,
      titleList: this.state.titleList,
      childTitleList: this.state.childTitleList,
    });
    defaultscreen.setState({
      isEditor: this.state.isEditor,
    });
    toggleSpinner(this.state.isLoading);
    if (this.state.isInit) this.render(); // 처음일 때만 전체를 렌더링
  };

  let postLocalSaveKey = `temp-post-${this.state.postId}`;

  const documentList = new DocumentList({
    $target: $page,
    initialState: this.state.documentList,

    onClick: async (clickId) => {
      if (!this.state.isLoading) {
        if (timer !== null) {
          clearTimeout(timer);
        }
        this.setState({ ...this.state });
        push(`/documents/${clickId}`);
        this.setState({ ...this.state, postId: clickId, isLoading: true });
        fetchPost();
      }
    },

    onAdd: async (clickId) => {
      if (!this.state.isLoading) {
        const postDocument = await createDocument("", clickId);
        if (this.state.isLoading) return;
        this.setState({ ...this.state, isLoading: true });
        await fetchDocumentList();
        push(`/documents/${postDocument.id}`);
      }
    },

    onDelete: async (clickId) => {
      if (!this.state.isLoading) {
        await deleteDocument(clickId);
        this.setState({ ...this.state, isLoading: true });
        await fetchDocumentList();
        if (this.state.postId === clickId) {
          push("/");
        }
      }
    },
  });

  const fetchDocumentList = async () => {
    const newDocumentList = await getAllDocument();

    const titleList = getTitleList(newDocumentList);

    this.setState({
      ...this.state,
      documentList: newDocumentList,
      titleList,
      isLoading: false,
    });
  };

  let timer = null;
  const defaultscreen = new DefaultScreen({ $target: $page });
  defaultscreen.render();
  const editor = new Editor({
    $target: $page,
    initialState: {
      title: this.state.post.title,
      content: this.state.post.content,
      isEditor: this.state.isEditor,
      titleList: this.state.titleList,
      childTitleList: this.state.childTitleList,
    },

    onEditing: (post) => {
      if (timer !== null) {
        clearTimeout(timer);
      }

      timer = setTimeout(async () => {
        {
          const putPost = await updateDocument(this.state.postId, post);
          this.setState({ ...this.state, post, selectedDocument: putPost });
          editor.render();
          fetchDocumentList();
          documentList.render();
        }
      }, SELECT_TIME);
    },
  });

  function toggleSpinner(isLoading) {
    const spinner = document.querySelector(".loading");
    if (isLoading) {
      spinner.classList.add("visible");
    } else {
      spinner.classList.remove("visible");
    }
  }

  const fetchPost = async () => {
    if (this.state.isLoading) return;
    const { postId } = this.state;
    if (postId !== "new") {
      const post = await getDocument(postId);
      const childTitleList = getChildTitleList(post);
      this.setState({
        ...this.state,
        post,
        childTitleList,
        selectedDocument: post,
        isLoading: false,
        isInit: false,
      });
      editor.render();
    }
  };

  this.render = () => {
    $target.appendChild($page);
  };
}
