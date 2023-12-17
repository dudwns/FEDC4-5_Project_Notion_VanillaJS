export default function markdownChange(richContent, state) {
  if (state.content) {
    richContent = state.content.replace(/<div>/g, "<br>").replace(/<\/div>/g, "");
  }

  return richContent
    .split("<br>")
    .map((line) => {
      if (line.indexOf("# ") === 0) {
        return `<h1>${line.substr(2)}</h1>`;
      } else if (line.indexOf("## ") === 0) {
        return `<h2>${line.substr(3)}</h2>`;
      } else if (line.indexOf("### ") === 0) {
        return `<h3>${line.substr(4)}</h3>`;
      } else if (line.indexOf("- ") === 0) {
        return `<li>${line.substr(2)}</li>`;
      } else {
        if (state.titleList) {
          for (const titleItem of state.titleList) {
            if (line.indexOf(titleItem.title) !== -1) {
              const replacedLine = line.replace(
                titleItem.title,
                `<a class="link" data-id=${titleItem.id}>${titleItem.title}</a>`
              );
              return replacedLine;
            }
          }
        }
      }
      return line;
    })
    .join("<br>");
}
