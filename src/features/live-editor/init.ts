import { prettyAlignLines } from "./formatter";

const EDITOR_INITIALIZED_ATTR = "data-live-editor-initialized";

function getEditableElement(pre: HTMLElement): HTMLElement {
  const code = pre.querySelector("code");
  return (code as HTMLElement) ?? pre;
}

function getTextContent(element: HTMLElement): string {
  return element.textContent ?? "";
}

function setTextContent(element: HTMLElement, text: string): void {
  element.textContent = text;
}

function updateButtonStatus(button: HTMLButtonElement, label: string): void {
  const original = button.dataset.originalLabel ?? button.textContent ?? "";
  button.textContent = label;
  window.setTimeout(() => {
    button.textContent = original;
  }, 1200);
}

function insertTextAtCursor(target: HTMLElement, text: string): void {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    setTextContent(target, getTextContent(target) + text);
    return;
  }

  const range = selection.getRangeAt(0);
  if (!target.contains(range.commonAncestorContainer)) {
    setTextContent(target, getTextContent(target) + text);
    return;
  }

  range.deleteContents();
  const textNode = document.createTextNode(text);
  range.insertNode(textNode);
  range.setStartAfter(textNode);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
}

function getToolButton(
  wrapper: HTMLElement,
  tool: "copy" | "reset" | "pretty",
): HTMLButtonElement | null {
  return wrapper.querySelector<HTMLButtonElement>(
    `button[data-code-tool="${tool}"]`,
  );
}

export function initLiveEditors(): void {
  const originalMap = new WeakMap<HTMLElement, string>();
  const wrappers = document.querySelectorAll<HTMLElement>(
    "article .code-editor-wrapper",
  );

  wrappers.forEach((wrapper) => {
    const pre = wrapper.querySelector<HTMLElement>("pre.live-editor-pre");
    if (!pre || pre.hasAttribute(EDITOR_INITIALIZED_ATTR)) {
      return;
    }
    pre.setAttribute(EDITOR_INITIALIZED_ATTR, "true");

    const editable = getEditableElement(pre);
    originalMap.set(editable, getTextContent(editable));

    editable.setAttribute("contenteditable", "plaintext-only");
    if (editable.contentEditable !== "plaintext-only") {
      editable.setAttribute("contenteditable", "true");
    }
    editable.setAttribute("spellcheck", "false");
    editable.setAttribute("autocapitalize", "off");
    editable.setAttribute("autocomplete", "off");
    editable.setAttribute("autocorrect", "off");
    editable.classList.add("live-editor-content");

    editable.addEventListener("paste", (event) => {
      event.preventDefault();
      const text = event.clipboardData?.getData("text/plain") ?? "";
      insertTextAtCursor(editable, text);
    });

    editable.addEventListener("keydown", (event) => {
      if (event.key !== "Tab") {
        return;
      }
      event.preventDefault();
      insertTextAtCursor(editable, "  ");
    });

    const copyButton = getToolButton(wrapper, "copy");
    if (copyButton) {
      copyButton.dataset.originalLabel = copyButton.textContent ?? "Copy";
      copyButton.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(getTextContent(editable));
          updateButtonStatus(copyButton, "Copied!");
        } catch {
          updateButtonStatus(copyButton, "Failed");
        }
      });
    }

    const resetButton = getToolButton(wrapper, "reset");
    if (resetButton) {
      resetButton.dataset.originalLabel = resetButton.textContent ?? "Reset";
      resetButton.addEventListener("click", () => {
        setTextContent(editable, originalMap.get(editable) ?? "");
      });
    }

    const prettyButton = getToolButton(wrapper, "pretty");
    if (prettyButton) {
      prettyButton.dataset.originalLabel = prettyButton.textContent ?? "Pretty";
      prettyButton.addEventListener("click", () => {
        const current = getTextContent(editable);
        setTextContent(editable, prettyAlignLines(current));
      });
    }
  });
}
