"use strict";


/* =========================================
   DOM ELEMENTS
========================================= */

const jsonInput =
  document.getElementById("jsonInput");

const formatBtn =
  document.getElementById("formatBtn");

const clearBtn =
  document.getElementById("clearBtn");

const exampleBtn =
  document.getElementById("exampleBtn");

const expandAllBtn =
  document.getElementById("expandAllBtn");

const collapseAllBtn =
  document.getElementById("collapseAllBtn");

const jsonStatus =
  document.getElementById("jsonStatus");

const errorMessage =
  document.getElementById("errorMessage");

const result =
  document.getElementById("result");

const meta =
  document.getElementById("meta");

const threads =
  document.getElementById("threads");


/* =========================================
   EXAMPLE DATA
========================================= */

const exampleData = {

  meta: {
    appId: "com.bluetriangle.android.demo",
    version: "2.19.8",
    platform: "Android",
    date: "1788871421372"
  },

  threads: [

    {
      id: "2",

      name: "main",

      crashed: true,

      caused:
        "android.util.AndroidRuntimeException: Manual Crash",

      stack: [

        {
          fLine:
            "at com.bluetriangle.android.demo.groupingpoc.tabs.FourthTabFragment.onViewCreated$lambda$0(FourthTabFragment.kt:51)"
        },

        {
          fLine:
            "at com.bluetriangle.android.demo.groupingpoc.tabs.FourthTabFragment.$r8$lambda$o6MLDbfFwXoWc-iaOZGYbmY4fwc(FourthTabFragment.kt:0)"
        },

        {
          fLine:
            "at com.bluetriangle.android.demo.groupingpoc.tabs.FourthTabFragment$$ExternalSyntheticLambda0.onClick(D8$$SyntheticClass:0)"
        },

        {
          fLine:
            "at android.view.View.performClick(View.java:8220)"
        },

        {
          fLine:
            "at com.google.android.material.button.MaterialButton.performClick(MaterialButton.java:1202)"
        },

        {
          fLine:
            "at android.view.View.performClickInternal(View.java:8197)"
        },

        {
          fLine:
            "at android.view.View.-$$Nest$mperformClickInternal(View.java:0)"
        },

        {
          fLine:
            "at android.view.View$PerformClick.run(View.java:32040)"
        },

        {
          fLine:
            "at android.os.Handler.handleCallback(Handler.java:1082)"
        },

        {
          fLine:
            "at android.os.Handler.dispatchMessageImpl(Handler.java:1082)"
        },

        {
          fLine:
            "at android.os.Handler.dispatchMessage(Handler.java:126)"
        },

        {
          fLine:
            "at android.os.Looper.loopOnce(Looper.java:295)"
        },

        {
          fLine:
            "at android.os.Looper.loop(Looper.java:398)"
        },

        {
          fLine:
            "at android.app.ActivityThread.main(ActivityThread.java:9569)"
        },

        {
          fLine:
            "at java.lang.reflect.Method.invoke(Native Method)"
        },

        {
          fLine:
            "at com.android.internal.os.RuntimeInit$MethodAndArgsCaller.run(RuntimeInit.java:575)"
        },

        {
          fLine:
            "at com.android.internal.os.ZygoteInit.main(ZygoteInit.java:918)"
        }

      ]
    }

  ]
};


/* =========================================
   HTML ESCAPING
========================================= */

function escapeHtml(value) {

  return String(value ?? "")

    .replace(/&/g, "&amp;")

    .replace(/</g, "&lt;")

    .replace(/>/g, "&gt;")

    .replace(/"/g, "&quot;")

    .replace(/'/g, "&#039;");
}


/* =========================================
   NORMALIZE PLATFORM
========================================= */

function getPlatform(data) {

  const platform =
    data?.meta?.platform || "";

  return String(platform)
    .trim()
    .toLowerCase();
}


/* =========================================
   CHECK IOS
========================================= */

function isIOS(data) {

  const platform =
    getPlatform(data);

  return (
    platform === "ios" ||
    platform.includes("ios")
  );
}


/* =========================================
   STATUS
========================================= */

function setStatus(
  message,
  type = ""
) {

  jsonStatus.textContent =
    message;

  jsonStatus.className =
    "status";

  if (type) {
    jsonStatus.classList.add(type);
  }
}


/* =========================================
   ERROR
========================================= */

function showError(message) {

  errorMessage.textContent =
    message;

  errorMessage.classList.remove(
    "hidden"
  );

  result.classList.add(
    "hidden"
  );

  setStatus(
    "Invalid JSON",
    "error"
  );
}


function hideError() {

  errorMessage.classList.add(
    "hidden"
  );
}


/* =========================================
   RENDER METADATA
========================================= */

/* =========================================
   FORMAT EPOCH DATE
========================================= */

function formatEpochDate(value) {

  if (value === null || value === undefined || value === "") {
    return "—";
  }

  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return String(value);
  }

  // Support both epoch seconds and epoch milliseconds.
  const milliseconds =
    Math.abs(numericValue) < 100000000000
      ? numericValue * 1000
      : numericValue;

  const date = new Date(milliseconds);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  const weekdays = [
    "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
  ];

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
  ];

  const hours = date.getHours();
  const hour12 = hours % 12 || 12;
  const period = hours >= 12 ? "PM" : "AM";

  const pad = (number) =>
    String(number).padStart(2, "0");

  return `${weekdays[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()} at ${pad(hour12)}:${pad(date.getMinutes())}:${pad(date.getSeconds())} ${period}`;
}

function renderMeta(data) {

  const metadata =
    data.meta || {};

  const platform =
    metadata.platform || "Unknown";

  const platformLower =
    String(platform)
      .toLowerCase();


  let platformClass =
    "";

  if (platformLower.includes("android")) {

    platformClass =
      "platform-android";

  } else if (
    platformLower.includes("ios")
  ) {

    platformClass =
      "platform-ios";
  }


  meta.innerHTML = `

    <div class="meta-card">

      <span class="meta-label">
        App ID
      </span>

      <span class="meta-value">
        ${escapeHtml(
          metadata.appId || "—"
        )}
      </span>

    </div>


    <div class="meta-card">

      <span class="meta-label">
        Version
      </span>

      <span class="meta-value">
        ${escapeHtml(
          metadata.version || "—"
        )}
      </span>

    </div>


    <div class="meta-card">

      <span class="meta-label">
        Platform
      </span>

      <span class="meta-value">

        ${escapeHtml(platform)}

        ${
          platform !== "Unknown"
            ? `
              <span
                class="platform-badge ${platformClass}"
              >
                ${escapeHtml(platform)}
              </span>
            `
            : ""
        }

      </span>

    </div>


    <div class="meta-card">

      <span class="meta-label">
        Date
      </span>

      <span class="meta-value">
        ${escapeHtml(
          formatEpochDate(metadata.date)
        )}
      </span>

    </div>

  `;
}


/* =========================================
   DETERMINE FRAME TYPE
========================================= */

function getFrameClass(line) {

  const value =
    String(line || "")
      .toLowerCase();


  /*
   * Highlight application frames.
   *
   * This is intentionally generic.
   */
  if (
    value.includes("com.bluetriangle")
  ) {

    return "app-frame";
  }


  return "system-frame";
}


/* =========================================
   RENDER SINGLE STACK FRAME
========================================= */

function renderStackFrame(
  frame,
  index,
  showNumbers
) {

  const line =
    typeof frame === "string"
      ? frame
      : frame?.fLine || "";


  const frameClass =
    getFrameClass(line);


  /*
   * IMPORTANT:
   *
   * Frame numbers are rendered ONLY
   * when platform is iOS.
   */
  const frameNumber =
    showNumbers &&
    typeof frame === "object" &&
    frame !== null &&
    Number.isInteger(Number(frame.i))
      ? Number(frame.i)
      : index;

  const numberHtml =
    showNumbers
      ? `
        <span class="frame-number">
          #${escapeHtml(frameNumber)}
        </span>
      `
      : "";


  return `
    <div class="stack-line ${frameClass}">
      ${numberHtml}
      <span class="frame-text">${escapeHtml(line)}</span>
    </div>
  `;
}


/* =========================================
   RENDER THREADS
========================================= */

function renderThreads(
  threadData,
  data
) {

  if (
    !Array.isArray(threadData) ||
    threadData.length === 0
  ) {

    threads.innerHTML = `
      <div class="thread">
        <div class="empty">
          No threads found in this crash report.
        </div>
      </div>
    `;

    return;
  }


  const showNumbers =
    isIOS(data);


  threads.innerHTML =
    threadData
      .map((thread, index) => {

        const id =
          thread?.id !== undefined
            ? String(thread.id)
            : String(index + 1);


        const name =
          thread?.name ||
          `Thread ${index + 1}`;


        const stack =
          Array.isArray(thread?.stack)
            ? thread.stack
            : [];


        const stackHtml =
          stack.length

            ? stack
                .map(
                  (frame, frameIndex) =>
                    renderStackFrame(
                      frame,
                      frameIndex,
                      showNumbers
                    )
                )
                .join("")

            : `
                <div class="empty">
                  No stack frames available.
                </div>
              `;


        const causeHtml =
          thread?.caused
            ? `
              <div class="cause">
                <span class="cause-label">Cause:</span>
                <span class="cause-text">${escapeHtml(thread.caused)}</span>
              </div>
            `
            : "";


        return `
          <article
            class="thread"
            data-thread-id="${escapeHtml(id)}"
          >

            <div class="thread-header">

              <div class="thread-info">

                <span class="thread-name">
                  ${escapeHtml(name)}
                </span>

                <span class="thread-id">
                  #${escapeHtml(id)}
                </span>

                ${
                  thread?.crashed
                    ? `
                      <span class="crashed-badge">
                        Crashed
                      </span>
                    `
                    : ""
                }

              </div>


              <button
                class="btn btn-secondary thread-toggle"
                type="button"
                aria-expanded="false"
              >

                <span class="toggle-label">
                  View Stack
                </span>

                <span class="chevron">
                  ▼
                </span>

              </button>

            </div>


            ${causeHtml}


            <div class="stack-panel">

              <div class="stack">
                ${stackHtml}
              </div>

            </div>

          </article>
        `;

      })
      .join("");


  attachThreadButtons();
}


/* =========================================
   THREAD BUTTON EVENTS
========================================= */

function attachThreadButtons() {

  threads
    .querySelectorAll(
      ".thread-toggle"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const thread =
            button.closest(".thread");


          const open =
            thread.classList.toggle(
              "open"
            );


          button.setAttribute(
            "aria-expanded",
            String(open)
          );


          const label =
            button.querySelector(
              ".toggle-label"
            );


          if (label) {

            label.textContent =
              open
                ? "Hide Stack"
                : "View Stack";
          }

        }
      );

    });
}


/* =========================================
   FORMAT STACK TRACE
========================================= */

function formatStackTrace() {

  hideError();


  const raw =
    jsonInput.value.trim();


  if (!raw) {

    showError(
      "Please paste a JSON crash report first."
    );

    return;
  }


  let data;


  try {

    data =
      JSON.parse(raw);

  } catch (error) {

    showError(
      `Invalid JSON:\n${error.message}`
    );

    return;
  }


  /*
   * Root validation
   */

  if (
    typeof data !== "object" ||
    data === null ||
    Array.isArray(data)
  ) {

    showError(
      "The root JSON value must be an object."
    );

    return;
  }


  /*
   * Threads validation
   */

  if (
    data.threads !== undefined &&
    !Array.isArray(data.threads)
  ) {

    showError(
      'Invalid format: "threads" must be an array.'
    );

    return;
  }


  /*
   * Render application information.
   */

  renderMeta(data);


  /*
   * Render threads.
   */

  renderThreads(
    data.threads || [],
    data
  );


  /*
   * Show result.
   */

  result.classList.remove(
    "hidden"
  );


  /*
   * Pretty-print JSON in editor.
   */

  jsonInput.value =
    JSON.stringify(
      data,
      null,
      2
    );


  const count =
    Array.isArray(data.threads)
      ? data.threads.length
      : 0;


  setStatus(
    `${count} thread(s) loaded`,
    "success"
  );


  /*
   * Scroll to result.
   */

  result.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}


/* =========================================
   CLEAR
========================================= */

function clearAll() {

  jsonInput.value = "";

  meta.innerHTML = "";

  threads.innerHTML = "";

  result.classList.add(
    "hidden"
  );

  hideError();

  setStatus("Ready");
}


/* =========================================
   LOAD EXAMPLE
========================================= */

function loadExample() {

  jsonInput.value =
    JSON.stringify(
      exampleData,
      null,
      2
    );


  hideError();

  setStatus(
    "Example loaded",
    "success"
  );


  /*
   * Automatically display example.
   */

  formatStackTrace();
}


/* =========================================
   EXPAND ALL
========================================= */

function expandAll() {

  threads
    .querySelectorAll(".thread")
    .forEach(thread => {

      thread.classList.add("open");


      const button =
        thread.querySelector(
          ".thread-toggle"
        );


      if (button) {

        button.setAttribute(
          "aria-expanded",
          "true"
        );


        const label =
          button.querySelector(
            ".toggle-label"
          );


        if (label) {
          label.textContent =
            "Hide Stack";
        }

      }

    });
}


/* =========================================
   COLLAPSE ALL
========================================= */

function collapseAll() {

  threads
    .querySelectorAll(".thread")
    .forEach(thread => {

      thread.classList.remove(
        "open"
      );


      const button =
        thread.querySelector(
          ".thread-toggle"
        );


      if (button) {

        button.setAttribute(
          "aria-expanded",
          "false"
        );


        const label =
          button.querySelector(
            ".toggle-label"
          );


        if (label) {
          label.textContent =
            "View Stack";
        }

      }

    });
}


/* =========================================
   BUTTON EVENTS
========================================= */

formatBtn.addEventListener(
  "click",
  formatStackTrace
);


clearBtn.addEventListener(
  "click",
  clearAll
);


exampleBtn.addEventListener(
  "click",
  loadExample
);


expandAllBtn.addEventListener(
  "click",
  expandAll
);


collapseAllBtn.addEventListener(
  "click",
  collapseAll
);


/* =========================================
   KEYBOARD SHORTCUT
========================================= */

jsonInput.addEventListener(
  "keydown",
  event => {

    /*
     * Ctrl + Enter on Windows/Linux
     *
     * Cmd + Enter on macOS
     */

    if (
      (event.ctrlKey || event.metaKey) &&
      event.key === "Enter"
    ) {

      event.preventDefault();

      formatStackTrace();
    }

  }
);
