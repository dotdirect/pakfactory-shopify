# PakFactory Shopify Theme

This repository contains the custom Shopify theme for **PakFactory**, now with all theme files located at the root level of the repository for Shopify GitHub integration compatibility.

---

## 📁 Folder Structure

```
/           # Root-level theme files
├── assets/        # Static assets: CSS, JavaScript, images, fonts
├── config/        # Theme configuration and settings
├── layout/        # Theme layout files (e.g., theme.liquid)
├── locales/       # Translation and language files
├── sections/      # Reusable customizable content blocks
├── snippets/      # Small reusable Liquid files
├── templates/     # Page, product, collection templates
```

---

## 🧰 Getting Started

### Requirements

Make sure you have the following tools installed:

- [Shopify CLI](https://shopify.dev/docs/themes/tools/cli)
- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) (if using tooling like Tailwind, Webpack, etc.)

---

## 🚀 Development Workflow

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/pakfactory-shopify.git
cd pakfactory-shopify
```

### 2. Log in to Shopify

```bash
shopify login --store your-store.myshopify.com
```

### 3. Start Local Development

```bash
shopify theme dev
```

This will start a local development server with live reload.

---

## 🔁 Common Commands

| Command                     | Description                       |
| --------------------------- | --------------------------------- |
| `shopify theme pull`        | Pull latest theme from store      |
| `shopify theme push`        | Push theme to development theme   |
| `shopify theme push --live` | Deploy to live store (⚠️ caution) |
| `shopify theme serve`       | (Legacy) Serve theme locally      |
| `shopify theme dev`         | Run theme locally                 |

---

## 🌳 Branch Strategy

- `main`: Production-ready code
- `dev`: Active development branch
- `feature/*`: New features or sections
- `fix/*`: Bug fixes

Use pull requests to merge into `main`.

---

## 🧪 Theme Configuration

The `config/settings_data.json` file contains store-specific settings. You may choose to ignore this file in version control (see `.gitignore`) to avoid overwriting live theme settings when deploying.

---

## 📦 Deployment

To push to the **live theme**, use:

```bash
shopify theme push --live
```

> ⚠️ Always test thoroughly in development before pushing live.

---

## 📝 License

This project is private and proprietary. All rights reserved by PakFactory.

---

## 🤝 Contributing

1. Create a new branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m "Add your message"`
3. Push to GitHub and create a pull request.
