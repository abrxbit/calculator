const mainDisplay =
  document.getElementById("mainDisplay");

const expressionHistory =
  document.getElementById("expressionHistory");

const buttons =
  document.querySelectorAll(".key");

const themeToggle =
  document.getElementById("themeToggle");

const themeIcon =
  document.getElementById("themeIcon");

const modeLabel =
  document.getElementById("modeLabel");


let expression = "";
let resultShown = false;
let lightMode = false;


/* ===============================
   DISPLAY OPERATOR SYMBOLS
=============================== */

function prettyExpression(value) {

  return value
    .replace(/\*/g, " × ")
    .replace(/\//g, " ÷ ")
    .replace(/\+/g, " + ")
    .replace(/-/g, " − ")
    .replace(/\s+/g, " ")
    .trim();
}


/* ===============================
   FIT LONG DISPLAY
=============================== */

function fitDisplay() {

  const length =
    mainDisplay.textContent.length;


  if (
    mainDisplay.classList.contains(
      "result-mode"
    )
  ) {

    if (length > 12) {

      mainDisplay.style.fontSize =
        "42px";

    } else if (length > 9) {

      mainDisplay.style.fontSize =
        "52px";

    } else {

      mainDisplay.style.fontSize =
        "";
    }

    return;
  }


  if (length > 18) {

    mainDisplay.style.fontSize =
      "30px";

  } else if (length > 13) {

    mainDisplay.style.fontSize =
      "37px";

  } else {

    mainDisplay.style.fontSize =
      "";
  }
}


/* ===============================
   LIVE EXPRESSION
=============================== */

function showLiveExpression() {

  expressionHistory.classList.remove(
    "show"
  );

  expressionHistory.textContent = "";


  mainDisplay.classList.remove(
    "result-mode"
  );

  mainDisplay.classList.add(
    "expression-mode"
  );


  mainDisplay.style.fontSize = "";


  if (!expression) {

    mainDisplay.textContent = "0";

    mainDisplay.classList.remove(
      "expression-mode"
    );

    fitDisplay();

    return;
  }


  mainDisplay.textContent =
    prettyExpression(expression);


  fitDisplay();
}


/* ===============================
   RESULT FORMAT
=============================== */

function formatResult(number) {

  if (Number.isInteger(number)) {

    return String(number);
  }


  return Number(
    number.toFixed(8)
  ).toString();
}


/* ===============================
   CALCULATE
=============================== */

function calculate() {

  if (!expression) {
    return;
  }


  if (
    /[+\-*/]$/.test(expression)
  ) {
    return;
  }


  try {

    const valid =
      /^[0-9+\-*/.() ]+$/.test(
        expression
      );


    if (!valid) {
      throw new Error();
    }


    const answer =
      Function(
        `"use strict";
         return (${expression})`
      )();


    if (!Number.isFinite(answer)) {
      throw new Error();
    }


    const rounded =
      Math.round(
        (
          answer +
          Number.EPSILON
        )
        * 100000000
      )
      / 100000000;


    const oldExpression =
      prettyExpression(expression);


    const resultText =
      formatResult(rounded);


    mainDisplay.style.opacity = "0";

    mainDisplay.style.transform =
      "translateY(-10px) scale(.95)";


    setTimeout(() => {

      expressionHistory.textContent =
        oldExpression;


      expressionHistory.classList.add(
        "show"
      );


      mainDisplay.classList.remove(
        "expression-mode"
      );


      mainDisplay.classList.add(
        "result-mode"
      );


      mainDisplay.textContent =
        resultText;


      mainDisplay.style.opacity = "1";

      mainDisplay.style.transform =
        "translateY(0) scale(1)";


      fitDisplay();

    }, 170);


    expression = resultText;

    resultShown = true;

  } catch {

    expressionHistory.textContent =
      prettyExpression(expression);


    expressionHistory.classList.add(
      "show"
    );


    mainDisplay.classList.remove(
      "expression-mode"
    );


    mainDisplay.classList.add(
      "result-mode"
    );


    mainDisplay.textContent =
      "Error";


    expression = "";

    resultShown = true;

    fitDisplay();
  }
}


/* ===============================
   INPUT
=============================== */

function inputValue(value) {

  /* EQUALS */

  if (value === "=") {

    calculate();

    return;
  }


  /* NUMBER / DECIMAL */

  if (/^[0-9.]$/.test(value)) {

    if (resultShown) {

      expression = "";

      resultShown = false;

      expressionHistory.classList.remove(
        "show"
      );

      expressionHistory.textContent = "";
    }


    if (value === ".") {

      const currentNumber =
        expression
          .split(/[+\-*/]/)
          .pop();


      if (
        currentNumber.includes(".")
      ) {
        return;
      }


      if (!currentNumber) {

        expression += "0";
      }
    }


    expression += value;

    showLiveExpression();

    return;
  }


  /* OPERATORS */

  if (/^[+\-*/]$/.test(value)) {

    if (!expression) {

      if (value === "-") {

        expression = "-";

        showLiveExpression();
      }

      return;
    }


    if (resultShown) {

      resultShown = false;

      expressionHistory.classList.remove(
        "show"
      );

      expressionHistory.textContent = "";
    }


    if (
      /[+\-*/]$/.test(expression)
    ) {

      expression =
        expression.slice(0, -1);
    }


    expression += value;

    showLiveExpression();
  }
}


/* ===============================
   BUTTON CLICKS
=============================== */

buttons.forEach(button => {

  button.addEventListener(
    "click",
    () => {

      inputValue(
        button.dataset.value
      );
    }
  );
});


/* ===============================
   THEME ICON
=============================== */

function changeThemeIcon() {

  themeIcon.style.opacity = "0";

  themeIcon.style.transform =
    "rotate(140deg) scale(.45)";


  setTimeout(() => {

    if (lightMode) {

      themeIcon.className =
        "sun-shape";

      themeIcon.innerHTML = "";


      const rays =
        document.createElement("span");


      rays.className =
        "sun-rays";


      themeIcon.appendChild(rays);

    } else {

      themeIcon.className =
        "moon-shape";

      themeIcon.innerHTML = "";
    }


    themeIcon.style.opacity = "1";

    themeIcon.style.transform =
      lightMode
        ? "rotate(0deg) scale(1)"
        : "rotate(-13deg) scale(1)";

  }, 220);
}


/* ===============================
   THEME SWITCH
=============================== */

function setTheme() {

  document.body.classList.toggle(
    "light-mode",
    lightMode
  );


  themeToggle.classList.toggle(
    "active",
    lightMode
  );


  themeToggle.setAttribute(
    "aria-pressed",
    String(lightMode)
  );


  if (lightMode) {

    modeLabel.textContent =
      "Dark mode";


    themeToggle.setAttribute(
      "aria-label",
      "Switch to dark mode"
    );

  } else {

    modeLabel.textContent =
      "Light mode";


    themeToggle.setAttribute(
      "aria-label",
      "Switch to light mode"
    );
  }


  changeThemeIcon();
}


themeToggle.addEventListener(
  "click",
  () => {

    lightMode = !lightMode;

    setTheme();
  }
);


/* ===============================
   KEYBOARD SUPPORT
=============================== */

document.addEventListener(
  "keydown",
  event => {

    const key =
      event.key;


    if (/^[0-9.]$/.test(key)) {

      inputValue(key);
    }


    if (
      ["+", "-", "*", "/"]
        .includes(key)
    ) {

      inputValue(key);
    }


    if (
      key === "Enter" ||
      key === "="
    ) {

      event.preventDefault();

      inputValue("=");
    }


    if (key === "Backspace") {

      if (resultShown) {

        expression = "";

        resultShown = false;

        expressionHistory.textContent =
          "";

        expressionHistory.classList.remove(
          "show"
        );

      } else {

        expression =
          expression.slice(0, -1);
      }


      showLiveExpression();
    }


    if (key === "Escape") {

      expression = "";

      resultShown = false;

      expressionHistory.textContent = "";

      expressionHistory.classList.remove(
        "show"
      );

      showLiveExpression();
    }


    /* keyboard press animation */

    buttons.forEach(button => {

      const value =
        button.dataset.value;


      const matches =
        value === key ||

        (
          value === "=" &&
          key === "Enter"
        );


      if (matches) {

        button.classList.add(
          "pressed"
        );


        setTimeout(() => {

          button.classList.remove(
            "pressed"
          );

        }, 110);
      }
    });
  }
);


/* initial screen */

showLiveExpression();
