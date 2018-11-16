# Sometimes it's a README fix, or something like that - which isn't
# relevant for including in a project's CHANGELOG for example
declared_trivial = github.pr_title.include? "#trivial"

# Make it more obvious that a PR is a work in progress and shouldn't
# be merged yet
warn("PR is classed as Work in Progress") if github.pr_title.include? "[WIP]"

# Ensure a clean commits history
if git.commits.any? { |c| c.message =~ /^Merge branch/ }
  fail('Please rebase to get rid of the merge commits in this PR')
end

# Ensure that labels have been used on the PR
failure("Please add labels to this PR", sticky: false) if github.pr_labels.empty?

# Ensure there is a summary for a PR
failure("Please provide a summary in the Pull Request description", sticky: false) if github.pr_body.length < 5

# Ensure that all PRs have an assignee
warn("This PR does not have any assignees yet.", sticky: false) unless github.pr_json["assignee"]

# Warn when there is a big PR
warn("Big PR") if git.lines_of_code > 500

# Don't let testing shortcuts get into master by accident
fail("fdescribe left in tests") if `grep -r fdescribe specs/ `.length > 1
fail("fit left in tests") if `grep -r fit specs/ `.length > 1

prose.lint_files
prose.ignored_words = ["hacktoberfest"]
prose.check_spelling

# Local Variables:
# mode: ruby
# End:
