# Gitflow Workflow Guide for Collaborators

Welcome to the project! We're using the **Gitflow** workflow to keep our development process clean and organized. Follow this guide to contribute smoothly.

---

## 1. Install Gitflow (Only Once)

### Ubuntu/Debian:

```bash
sudo apt install git-flow
```

### macOS (Homebrew):

```bash
brew install git-flow
```

> Only install once. Skip this step if you already have Gitflow installed.

---

## 2. Clone the Repository and Set Up

```bash
git clone git@github.com:BoruIsakoJ/Deliveroo.git
cd Deliveroo
git checkout develop
git pull origin develop
```

Make sure you're working from the `develop` branch.

---

## 3. Start a New Feature Branch

To begin working on a new feature:

```bash
git flow feature start <feature-name>
```

This creates a new branch named `feature/<feature-name>` from `develop`.

Example:

```bash
git flow feature start login
```

---

## 💾 4. Work on Your Feature

- Make your changes.
- Commit regularly:

```bash
git add .
git commit -m "feat: implement login UI"
```

- Push your feature branch to the remote repo:

```bash
git push -u origin feature/login
```

---

## 5. Finish a Feature (When Done)


##  Open a Pull Request (PR)

If you want a teammate to review your code first:

```bash
git push origin feature/login
```

Then create a PR from `feature/login` → `develop` on GitHub.

---

## 6. Clean Up Merged Feature Branches

After merging, delete old branches:

```bash
git branch -d feature/login                # local
git push origin --delete feature/login     # remote
```

---

## Summary of Gitflow Commands

| Task                   | Command                                   |
| ---------------------- | ----------------------------------------- |
| Start a feature        | `git flow feature start <name>`           |
| Push feature to remote | `git push origin feature/<name>`          |
| Finish a feature       | `git flow feature finish <name>`          |
| Push updated develop   | `git push origin develop`                 |
| Delete feature branch  | `git branch -d feature/<name>`            |
| Delete remote feature  | `git push origin --delete feature/<name>` |
