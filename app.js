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
   EPOCH DATE FORMATTER
========================================= */

function formatEpochDate(value) {

  if (value === null || value === undefined || value === "") {
    return "—";
  }

  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return "—";
  }

  const milliseconds =
    numericValue < 100000000000
      ? numericValue * 1000
      : numericValue;

  const date = new Date(milliseconds);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  const parts = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  }).formatToParts(date);

  const get = (type) =>
    parts.find((part) => part.type === type)?.value || "";

  const month =
    get("month") === "Sep"
      ? "Sept"
      : get("month");

  return `${get("weekday")}, ${get("day")} ${month} ${get("year")} at ${get("hour")}:${get("minute")}:${get("second")} ${get("dayPeriod")}`;
}


/* =========================================
   PARSE CRASH PAYLOAD
========================================= */

function parseJsonString(value, name) {

  if (value === null || value === undefined || value === "") {
    return {};
  }

  if (typeof value !== "string") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    throw new Error(`Unable to parse ${name} JSON string.`);
  }
}


function parseCrashPayload(data) {

  const nativeApp = data?.NATIVEAPP || {};

  const eMeta =
    parseJsonString(
      nativeApp.eMeta,
      "eMeta"
    );

  const stackTrace =
    parseJsonString(
      nativeApp.stackTrace,
      "stackTrace"
    );

  return {
    meta: {
      appId: eMeta?.appId || "",
      version: nativeApp.appVersion || "",
      platform: eMeta?.platform || "",
      deviceType: eMeta?.deviceType || "",
      date: data?.time || ""
    },
    threads: Array.isArray(stackTrace?.threads)
      ? stackTrace.threads
      : []
  };
}


/* =========================================
   RENDER METADATA
========================================= */

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
        Device Type
      </span>

      <span class="meta-value">
        ${escapeHtml(
          metadata.deviceType || "—"
        )}
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
    frame.i !== undefined
      ? frame.i
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
   * Parse the nested crash payload.
   *
   * The final payload stores:
   * - NATIVEAPP.eMeta as a JSON string
   * - NATIVEAPP.stackTrace as a JSON string
   * - time as the root epoch value
   */

  let viewerData;

  try {

    viewerData =
      parseCrashPayload(data);

  } catch (error) {

    showError(
      error instanceof Error
        ? error.message
        : "Unable to parse crash payload."
    );

    return;
  }


  /*
   * Render application information.
   */

  renderMeta(viewerData);


  /*
   * Render threads.
   */

  renderThreads(
    viewerData.threads,
    viewerData
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
    Array.isArray(viewerData.threads)
      ? viewerData.threads.length
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

  const examplePayload = {
    time: "1788964742106",
    NATIVEAPP: {
      appVersion: "2.19.8",
      netState: "wifi",
      sdkId: "btt-android-sdk",
      eMeta: JSON.stringify({
        appId: "com.bluetriangle.android.demo",
        platform: "Android",
        deviceType: "Google sdk_gphone16k_arm64"
      }),
      deviceModel: "sdk_gphone16k_arm64",
      sdkVersion: "2.19.8",
      stackTrace: JSON.stringify({
        meta: { fVersion: "1.0.0" },
        threads: exampleData.threads.map((thread) => ({
          ...thread,
          stack: thread.stack.map((frame, index) => ({
            i: frame.i ?? index,
            fLine: frame.fLine
          }))
        }))
      })
    }
  };

  jsonInput.value = JSON.stringify(examplePayload, null, 2);
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
