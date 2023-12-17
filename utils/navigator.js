import { NON_TITLE } from "../components/DocumentList.js";

export default function navigator(navigatorText, state) {
  for (const titleItem of state.childTitleList) {
    if (titleItem) {
      navigatorText += `<span class="link-container"><img src="/assets/file-link.svg" class="file-link-img" alt="File Image"/><a class="link" data-id=${
        titleItem.id
      }>${titleItem.title || NON_TITLE}</a></span><br>`;
    }
  }
  return navigatorText;
}
