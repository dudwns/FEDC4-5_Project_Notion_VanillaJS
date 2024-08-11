export default function markdownChange(richContent, state) {
  if (state.content) {
    richContent = state.content;
  }

  return richContent
    .split("<div>")
    .map((line) => {
      line = line.replace(/<\/div>/g, "");
      if (line.indexOf("# ") === 0) {
        return line.replace(/^# (.*$)/gim, "<h1>$1</h1>");
      } else if (line.indexOf("## ") === 0) {
        return line.replace(/^## (.*$)/gim, "<h2>$1</h2>");
      } else if (line.indexOf("### ") === 0) {
        return line.replace(/^### (.*$)/gim, "<h3>$1</h3>");
      } else if (line.indexOf("- ") === 0) {
        return line.replace(/^- (.*)$/gim, "<ul><li>$1</li>");
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
    .join("<div>");
}
