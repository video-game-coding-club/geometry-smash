---
layout: default
title: "Developer Workflow"
---

# Fork the repository

This step is only for developers that are not added as contributors to
the repo. You can skip this step if you are a contributor and jump to
[Create a new branch](#create-a-new-branch).

A fork is created simply by clicking on the "Fork" button on the
repository Github page and follow the instructions.

# Clone the repository

In your forked repository press the "Clone" button and copy the
`https` or `ssh` link. Then use the following command.

~~~ Shell
$ git clone REPOSITORY_URI
~~~

# Create a new branch

In order to got code changes back to GitHub we will work through [pull
requests](https://help.github.com/articles/about-pull-requests/). Before
you start changing code you need to create a new branch:

~~~ Shell
$ git branch feature_x origin/master
~~~

Please choose a unique name for the branch. So instead of calling it
`feature_x` you could call it `issue_22` (if there is also an issue
#22 for it) or `experiment-nick`.

Now checkout that new branch:

~~~ Shell
$ git checkout feature_x
~~~

and start working!

# Commit changes

When you are happy with your changes (e.g. in `main.js`) you can
commit those changes to your branch with

~~~ Shell
$ git commit main.js
~~~

This will open an editor. Describe what you have changed so that the
others understand your changes. After committing the changes you need
to push them to GitHub.

# Push a branch to GitHub

Once you create and check out a new branch you can push it to GitHub
by running:

~~~ Shell
$ git push --set-upstream origin feature_x
~~~

After this step you will only have to run

~~~ Shell
$ git push
~~~

To push additional commits.
