export default function getChildTitleList(data = []) {
  return data.documents.map((document) => ({ id: document.id, title: document.title }));
}
