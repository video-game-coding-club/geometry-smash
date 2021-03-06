---
layout: default
title: "Test Game Locally"
---

# Test the game locally

If you are using CodeAnywhere or GitPod you can test your changes
directly in those environments. If you are developing on your own PC
then you may have to install additional software as described below.

## GitPod

Right click on `game.html` and open the file with the "Mini Browser".

## CodeAnywhere

Run the project which will open a new browser tab or window and show
webpage.

## Your own development environment (i.e. your own computer)

If you developing locally you need to install some additional software
to run and preview the game. Since we are using GitHub pages you can
refer to [how to set up GitHub Pages
locally](https://help.github.com/articles/setting-up-your-github-pages-site-locally-with-jekyll/):

~~~ Shell
$ gem install bundler
$ bundle install
~~~

Now you can build and serve the website by running

~~~ Shell
$ bundle exec jekyll serve
~~~
