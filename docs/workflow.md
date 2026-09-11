# Git workflow

For everyone on the team, including if this is your first time working in a
shared repository. Read this once; it will save a lot of confusion.

---

## The mental model

In a personal repo you usually commit straight to `main` and that's fine —
you're the only one there.

In a shared repo that breaks down fast: two people editing `main` at the same
time overwrite each other, and a mistake goes live immediately with no review.

So we use **branches**:

- `main` is the real site. It is always working. Nobody commits to it directly.
- Everyone else works on their own **branch** — a private copy of `main` where
  you can experiment freely without affecting anyone.
- When your work is ready, you open a **pull request (PR)** asking for your
  branch to be merged into `main`. Someone reviews it, then it merges.

That's the whole system.

---

## Day-to-day commands

### 1. Start from the latest `main`

Always do this before starting new work. It prevents most merge conflicts.

```bash
git checkout main
git pull origin main
```

### 2. Create your branch

```bash
git checkout -b feat/pricing-page
```

Naming convention:

| Prefix     | Use for                          | Example                       |
|------------|----------------------------------|-------------------------------|
| `feat/`    | new page or section              | `feat/pricing-page`           |
| `fix/`     | something broken                 | `fix/nav-overlap-mobile`      |
| `content/` | copy and text changes            | `content/homepage-headline`   |
| `design/`  | visual and styling changes       | `design/footer-spacing`       |
| `chore/`   | housekeeping, config, tooling    | `chore/add-favicons`          |

Use dashes, not spaces. Keep it short and descriptive.

### 3. Work, then commit

```bash
git status                    # see what you changed
git add .                     # stage everything
git commit -m "Add pricing table to pricing page"
```

Commit messages: say what the change does, in the present tense.
"Add pricing table" — not "added stuff" or "changes."

Commit often. Small commits are much easier to review and to undo.

### 4. Push your branch

```bash
git push -u origin feat/pricing-page
```

The `-u` is only needed the first time you push a branch. After that, plain
`git push` works.

### 5. Open a pull request

Go to the repo on GitHub. There will be a banner offering to open a PR from the
branch you just pushed. Click it, fill in the template, and request a reviewer.

### 6. After it merges

```bash
git checkout main
git pull origin main
git branch -d feat/pricing-page    # delete your local copy, it's merged now
```

---

## Common situations

### "I started working and forgot to make a branch"

You have uncommitted changes sitting on `main`. No problem — nothing is lost:

```bash
git checkout -b feat/my-work
```

Your changes come with you to the new branch. Commit as normal.

### "My branch is out of date / GitHub says there's a conflict"

Someone merged to `main` after you branched. Pull their work into your branch:

```bash
git checkout feat/my-work
git pull origin main
```

If git reports a conflict, it will mark the clashing sections inside the
affected files like this:

```
<<<<<<< HEAD
your version
=======
their version
>>>>>>> main
```

Open the file, decide what the correct final text is, delete the `<<<<<<<`,
`=======`, and `>>>>>>>` marker lines, then:

```bash
git add .
git commit -m "Merge main into feat/my-work"
git push
```

If you're not sure which version is right — ask. Don't guess.

### "I want to throw away my changes to a file"

```bash
git checkout -- path/to/file.html      # discard changes to one file
```

This is permanent. Make sure you mean it.

### "I committed something I shouldn't have"

Don't panic and don't force-push. Ask someone before doing anything else —
it's almost always recoverable, but some fixes make it worse.

---

## Rules

1. **Never commit directly to `main`.** Always branch.
2. **Never force-push** (`git push -f`) to a branch someone else is using.
   It rewrites history and breaks their copy.
3. **Never commit secrets** — API keys, passwords, tokens, `.env` files.
   Once pushed, treat them as compromised even if you delete them after.
4. **Pull before you branch.** Step 1 above, every time.
5. **One PR per topic.** A PR that changes the footer *and* rewrites the
   pricing copy is hard to review and hard to revert.
