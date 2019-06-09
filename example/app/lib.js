export const createElement = (tag, textContent) => {
  const fragment = document.createDocumentFragment();
  const element = document.createElement(tag);
  const text = document.createTextNode(textContent);
  fragment.appendChild(element);
  element.appendChild(text);
  return fragment;
};
