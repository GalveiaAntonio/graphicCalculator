# 🧮 fx Calculator

A clean and responsive **all-in-one calculator** built with **HTML, CSS and vanilla JavaScript**.

fx combines **Basic, Scientific and Graphing** modes in a single interface, with support for mathematical expressions, trigonometric functions, memory operations, calculation history and interactive graphs.

---

## ✨ Features

### 🔢 Basic Calculator

* Addition
* Subtraction
* Multiplication
* Division
* Decimal calculations
* Percentages
* Sign change
* Parentheses
* Backspace
* Clear

### 🧪 Scientific Calculator

* 📐 Trigonometric functions:

  * `sin`
  * `cos`
  * `tan`
* 🔄 Inverse trigonometric functions:

  * `sin⁻¹`
  * `cos⁻¹`
  * `tan⁻¹`
* 📈 Natural logarithm (`ln`)
* 🔟 Base-10 logarithm (`log`)
* √ Square root
* ∛ Cube root
* x² Powers and exponents
* `n!` Factorials
* `1/x` Reciprocals
* π Pi
* `e` Euler's number
* 🔄 Degree and radian modes
* 2️⃣ `2nd` functions

### 📈 Graphing Calculator

* Plot mathematical functions using `x`
* Interactive graph
* Zoom in and out
* Reset zoom
* Automatic Y-axis scaling
* Interactive cursor
* Displays `x` and `y` values
* Handles undefined values and discontinuities

### 🧠 Memory

* `MC` — Clear memory
* `MR` — Recall memory
* `M+` — Add to memory
* 🔴 Memory indicator

### 📜 Calculation History

* Stores the latest calculations
* Up to 8 previous calculations
* Click a previous calculation to restore its result
* Supports scientific notation

### ⌨️ Keyboard Support

fx can also be controlled using the keyboard.

| Key           | Action            |
| ------------- | ----------------- |
| `0–9`         | Numbers        |
| `.` / `,`     | Decimal point  |
| `+`           | Addition        |
| `-`           | Subtraction     |
| `*`           | Multiplication |
| `/`           | Division        |
| `( )`         | Parentheses    |
| `^`           | Power          |
| `!`           | Factorial       |
| `%`           | Percentage     |
| `x`           | Variable        |
| `Enter` / `=` | Calculate       |
| `Esc`         | Clear         |
| `Backspace`   | Delete          |

---

## ⚙️ Expression Engine

fx uses a **custom mathematical expression parser** written in JavaScript instead of `eval()`.

The parser supports:

* Operator precedence
* Arithmetic operators
* Unary operators
* Powers
* Postfix operators
* Parentheses
* Mathematical functions
* Constants
* Variables
* Implicit multiplication

### Examples

```text
2 + 3 × 4
2(3 + 4)
2π
sin(30)
√(25)
2^3
5!
x^2 + 2x + 1
```

The calculator also automatically balances missing closing parentheses while rejecting invalid expressions and unsupported characters.

---

## 🛠️ Technologies

* **HTML5**
* **CSS3**
* **JavaScript (ES6+)**
* **Canvas API**

No JavaScript frameworks or external calculation libraries are required.

---

## 🎨 Design

fx was designed around a minimal mathematical aesthetic, featuring:

* Responsive layout
* Paper-inspired background
* Grid-based visual language
* Compact calculator interface
* Dedicated scientific keypad
* Interactive graphing interface
* Accessibility-focused controls
* Reduced-motion support

---

## ♿ Accessibility

fx includes several accessibility improvements:

* Descriptive `aria-label` attributes
* ⌨Keyboard support
* Visible focus states
* `prefers-reduced-motion` support
* Semantic HTML elements

---

## 📁 Project Structure

```text
fx/
├── index.html
├── style.css
├── index.js
├── robots.txt
├── sitemap.xml
└── README.md
```

---
## 📌 Version

**fx v1.0**

The current version of the portfolio is available here:

### 👉 [calculatorfx.vercel.app/](https://calculatorfx.vercel.app/)

---

## 👨‍💻 Author

**Antonio Galveia**

© 2026 Antonio Galveia. All rights reserved.

---

<p align="center">
  Made with ☕, curiosity and a lot of CSS.
</p>