export const NON_TITLE = "제목 없음";
export default function DocumentList({ $target, initialState, onClick, onAdd, onDelete }) {
  const $document = document.createElement("div");

  $document.className = "documentList";

  $target.appendChild($document);

  this.state = initialState;

  this.setState = (nextState) => {
    this.state = nextState;
    this.render();
  };

  const renderNestedElements = (elements) => {
    if (!elements || elements.length === 0) {
      return "";
    }
    return elements
      .map(({ id, title, documents }) => {
        const hasDocument = documents && documents.length > 0;
        return `
        
        <ul class="document-list">
          <li data-id=${id} class="list" >
          <div class ="list-inner">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="openSvg" >
              <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
            <img src="/assets/file-list.svg" class="file-list-img" alt="File Image"/>
            <div id="title-text" class=${
              id === this.state.selectedDocument.id ? "selected" : "non-selected"
            } data-id="${id}">${title || NON_TITLE}</div>
            </div>
            <div class="btn-container">
              <button class="addBtn">+</button>
              <button class="deleteBtn">-</button>
            </div>
          </li>
            ${hasDocument ? `<ul>${renderNestedElements(documents)}</ul>` : ""}        
        </ul>
        
      `;
      })
      .join("");
  };

  this.render = () => {
    $document.innerHTML = `
    <div class="document-title-container">
    <img src="/assets/title.svg" class="document-title-img" alt="Title Image"/>
    <h2 class="document-title">김영준의 Notion</h2>
   
    </div>
    <div class="document-list-container">
      ${renderNestedElements(this.state.documentList)}
   </div>
    <div class="add-container">
      + 페이지 추가
    </div>
    `;

    $document.querySelector(".add-container").addEventListener("click", (e) => {
      onAdd(null);
    });
  };

  $document.addEventListener("click", (e) => {
    const $li = e.target.closest("li");

    if ($li) {
      const { id } = $li.dataset;
      const { className } = e.target;
      if (className === "deleteBtn") {
        onDelete(id);
      } else if (className === "addBtn") {
        onAdd(id);
      } else {
        onClick(id);
      }
    }
  });

  this.render();
}
