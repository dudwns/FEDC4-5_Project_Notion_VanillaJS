import DocumentList from "../components/DocumentList.js";
import Editor from "../components/Editor.js";
import { setItem, getItem, removeItem } from "../utils/storage.js";
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

export default function MainPage({ $target }) {
  const $page = document.createElement("div");
  $page.className = "container";
  const SELECT_TIME = 2000;
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
  };

  this.init = async (id) => {
    this.setState({ ...this.state, isEditor: id, postId: id || "new" });
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
    this.render();
  };

  let postLocalSaveKey = `temp-post-${this.state.postId}`;

  const documentList = new DocumentList({
    $target: $page,
    initialState: this.state.documentList,

    onClick: async (clickId) => {
      push(`/documents/${clickId}`);
      this.setState({ ...this.state, postId: clickId });
      fetchPost();
    },

    onAdd: async (clickId) => {
      const postDocument = await createDocument("", clickId);
      await fetchDocumentList();
      push(`/documents/${postDocument.id}`);
    },

    onDelete: async (clickId) => {
      await deleteDocument(clickId);
      await fetchDocumentList();
      if (this.state.postId === clickId) {
        push("/");
      }
    },
  });

  let timer = null;

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
        setItem(postLocalSaveKey, {
          ...post,
          tempSaveDate: new Date(),
        });

        const isNew = this.state.postId === "new";
        if (isNew) {
          const createPost = await request("/", {
            method: "POST",
            body: JSON.stringify(post),
          });

          history.replaceState(null, null, `/documents/${createPost.id}`);
          removeItem(postLocalSaveKey);

          this.setState({
            ...this.state,
            postId: createPost.id,
          });
        } else {
          const putPost = await updateDocument(this.state.postId, post);
          removeItem(postLocalSaveKey);
          this.setState({ ...this.state, post, selectedDocument: putPost });
          editor.render();
        }
      }, SELECT_TIME);
    },
  });

  const fetchDocumentList = async () => {
    const newDocumentList = await getAllDocument();

    const titleList = getTitleList(newDocumentList);

    this.setState({
      ...this.state,
      documentList: newDocumentList,
      titleList,
    });
  };

  const fetchPost = async () => {
    const { postId } = this.state;

    if (postId !== "new") {
      const post = await getDocument(postId);
      const childTitleList = getChildTitleList(post);

      const tempPost = getItem(postLocalSaveKey, {
        title: "",
        content: "",
      });
      if (tempPost.tempSaveDate && tempPost.tempSaveDate > post.updateAt) {
        if (confirm("저장되지 않은 임시 데이터가 있습니다. 불러올까요?")) {
          this.setState({
            ...this.state,
            post: tempPost,
          });
          removeItem(postLocalSaveKey);
          editor.render();
          return;
        }
      }
      this.setState({ ...this.state, post, childTitleList, selectedDocument: post });
      removeItem(postLocalSaveKey);
      editor.render();
    }
  };

  this.render = () => {
    $target.appendChild($page);
  };
}
