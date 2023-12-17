export default function getTitleList(data = []) {
  const stack = [...data];
  const titles = [];

  while (stack.length > 0) {
    const item = stack.pop();
    if (item.title !== "") {
      titles.push({ id: item.id, title: item.title });
    }

    if (item.documents.length > 0) {
      stack.push(...item.documents);
    }
  }

  return titles;
}
