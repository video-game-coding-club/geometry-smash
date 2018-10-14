---
layout: default
title: "Git"
---

# Configuring git

Please configure `git` by running

~~~
$ git config --local pull.ff only
$ git config --local pull.rebase preserve
$ git config --local push.default simple
$ git config --local user.name "Your Name"
$ git config --local user.email your@email
$ git config --local core.editor nano
~~~

# Updating your repository

In order to update your repository from GitHub, run the following
command:

~~~
$ git remote update --prune
$ git rebase origin/master master
~~~

# Looking at the commit history (log)

The whole commit history can be nicely visualized with

~~~
$ git log --graph --decorate --all
~~~
