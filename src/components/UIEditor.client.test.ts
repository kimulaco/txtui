// @vitest-environment happy-dom

import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  initUIEditorElement,
  initUIEditors,
  insertTextAtCursor,
} from "./UIEditor.client";

function renderEditor(content = "[ Button ]"): HTMLDivElement {
  const wrapper = document.createElement("div");
  wrapper.className = "code-editor-wrapper";
  wrapper.dataset.uiEditor = "";
  wrapper.innerHTML = `
    <div class="code-editor-header">
      <div class="code-tools">
        <button type="button" data-code-tool="copy">Copy</button>
        <button type="button" data-code-tool="reset">Reset</button>
        <button type="button" data-code-tool="pretty">Pretty</button>
      </div>
    </div>
    <pre class="live-editor-pre"><code>${content}</code></pre>
  `;
  return wrapper;
}

describe("UIEditor.client", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("appends text when no selection is available", () => {
    const target = document.createElement("code");
    target.textContent = "abc";
    vi.spyOn(window, "getSelection").mockReturnValue(null);

    insertTextAtCursor(target, "++");

    expect(target.textContent).toBe("abc++");
  });

  it("initializes editable content and tool buttons", async () => {
    vi.useFakeTimers();
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", {
      ...window.navigator,
      clipboard: { writeText },
    });

    const wrapper = renderEditor();
    document.body.append(wrapper);
    const originalMap = new WeakMap<HTMLElement, string>();
    const code = wrapper.querySelector("code")!;
    const copyButton = wrapper.querySelector<HTMLButtonElement>(
      'button[data-code-tool="copy"]',
    )!;
    const resetButton = wrapper.querySelector<HTMLButtonElement>(
      'button[data-code-tool="reset"]',
    )!;
    const prettyButton = wrapper.querySelector<HTMLButtonElement>(
      'button[data-code-tool="pretty"]',
    )!;

    initUIEditorElement(wrapper, originalMap);

    expect(code.classList.contains("live-editor-content")).toBe(true);
    expect(code.getAttribute("contenteditable")).toBe("plaintext-only");
    expect(copyButton.dataset.originalLabel).toBe("Copy");
    expect(resetButton.dataset.originalLabel).toBe("Reset");
    expect(prettyButton.dataset.originalLabel).toBe("Pretty");

    await copyButton.click();
    expect(writeText).toHaveBeenCalledWith("[ Button ]");
    expect(copyButton.textContent).toBe("Copied!");
    vi.runAllTimers();
    expect(copyButton.textContent).toBe("Copy");

    code.textContent = "changed";
    resetButton.click();
    expect(code.textContent).toBe("[ Button ]");

    code.textContent = "rough";
    prettyButton.click();
    expect(code.textContent).toBe("rough");
  });

  it("handles paste and tab input", () => {
    const wrapper = renderEditor("A");
    document.body.append(wrapper);
    const originalMap = new WeakMap<HTMLElement, string>();
    const code = wrapper.querySelector("code")!;
    const getSelection = vi.spyOn(window, "getSelection").mockReturnValue(null);

    initUIEditorElement(wrapper, originalMap);

    const pasteEvent = new Event("paste", { bubbles: true, cancelable: true });
    Object.defineProperty(pasteEvent, "clipboardData", {
      value: { getData: vi.fn(() => "B") },
    });
    code.dispatchEvent(pasteEvent);
    expect(code.textContent).toBe("AB");

    const tabEvent = new KeyboardEvent("keydown", {
      key: "Tab",
      bubbles: true,
      cancelable: true,
    });
    code.dispatchEvent(tabEvent);
    expect(code.textContent).toBe("AB  ");
    expect(getSelection).toHaveBeenCalled();
  });

  it("skips wrappers that are already initialized", () => {
    const wrapper = renderEditor();
    document.body.append(wrapper);
    const pre = wrapper.querySelector("pre")!;
    const code = wrapper.querySelector("code")!;
    const originalMap = new WeakMap<HTMLElement, string>();

    pre.setAttribute("data-live-editor-initialized", "true");
    initUIEditorElement(wrapper, originalMap);

    expect(code.getAttribute("contenteditable")).toBeNull();
  });

  it("initializes every matching wrapper in the document", () => {
    const first = renderEditor("one");
    const second = renderEditor("two");
    document.body.append(first, second);

    initUIEditors();

    expect(
      first.querySelector("code")?.classList.contains("live-editor-content"),
    ).toBe(true);
    expect(
      second.querySelector("code")?.classList.contains("live-editor-content"),
    ).toBe(true);
  });
});
