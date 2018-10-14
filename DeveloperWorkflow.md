---
layout: default
title: "Developer Workflow"
---

# Forking the repo

This step is only for developers that are not added as contributors to
the repo. You can skip this step if you are contributor and jump to
Creating a new branch.

Press Fork-button in Github and follow the instructions.

# Clone the repo

In your forked repo press the Clone-button and copy the https or ssh
link. Then use follow command.

~~~
git clone you_link_here
~~~

# Creating  a new branch

In order to got code changes back to GitHub we will work through [pull
requests](https://help.github.com/articles/about-pull-requests/). Before
you start changing code you need to create a new branch:

~~~
git branch feature_x origin/master
~~~

Please choose a unique name for the branch. So instead of calling it
`feature_x` you could call it `issue_22` (if there is also an issue
#22 for it) or `experiment-nick`.

Now checkout that new branch:

~~~
git checkout feature_x
~~~

and start working!

# Committing changes

When you are happy with your changes (e.g. in `main.js`) you can
commit those changes to your branch with

~~~
git commit main.js
~~~

This will open an editor. Describe what you have changed so that the
others understand your changes. After committing the changes you need
to push them to GitHub.

# Pushing a branch to GitHub

Once you create and check out a new branch you can push it to GitHub
by running:

~~~
git push --set-upstream origin feature_x
~~~

After this step you will only have to run

~~~
git push
~~~

To push additional commits.
