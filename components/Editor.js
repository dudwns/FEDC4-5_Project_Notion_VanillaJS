import markdownChange from "../utils/markdownChange.js";
import navigator from "../utils/navigator.js";
import { push } from "../utils/router.js";
import { NON_TITLE } from "./DocumentList.js";

export default function Editor({ $target, initialState, onEditing }) {
  const $editor = document.createElement("div");

  $editor.innerHTML = `
  <div class="editor-container">
    <input class="title" type="text" placeholder="${NON_TITLE}" name="title"/>
    <div class="editor" name="content" contentEditable="true" placeholder="내용을 입력하세요."></div>
    <div class="navigator"></div>
  </div>
  `;

  $target.appendChild($editor);

  this.state = initialState;

  this.setState = (nextState) => {
    this.state = nextState;
    $editor.className = this.state.isEditor ? "block" : "none";
  };

  this.render = () => {
    let richContent = "";
    let htmlText = markdownChange(richContent, this.state);
    if (this.state.childTitleList) {
      let navigatorText = "";
      navigatorText = navigator(navigatorText, this.state);
      const $navigator = document.querySelector(".navigator");
      if ($navigator) {
        $navigator.innerHTML = navigatorText;
      }
    }

    const $titleInput = $editor.querySelector("[name=title]");
    const $contentInput = $editor.querySelector("[name=content]");

    $titleInput.value = this.state.title;
    $contentInput.innerHTML = htmlText;

    $titleInput.addEventListener("keydown", (e) => {
      handleKeyDown(e);
    });

    $contentInput.addEventListener("keydown", (e) => {
      handleKeyDown(e);
    });

    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        const nextState = {
          ...this.state,
          title: $titleInput.value,
          content: $contentInput.innerHTML,
        };
        this.setState(nextState);
        onEditing(this.state);
      }
    };

    if (this.state.content) {
      $editor.addEventListener("click", (e) => {
        const $a = e.target.closest("a");
        if ($a) {
          const { id } = $a.dataset;
          push(`/documents/${id}`);
        }
      });
    }

    const moveCursorToEnd = (element) => {
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(element);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }; // 커서를 에디터 끝으로 이동하는 함수
    moveCursorToEnd($contentInput);
  };

  this.render();
}
