---
name: fosholhaat-skill-forking
description: Use when adapting an existing generic skill, workflow, or prompt pattern into a FosholHaat-specific skill so that the result matches project language, approved docs, and real project triggers without mutating unrelated global skills.
---

# FosholHaat Skill Forking

Use this skill when turning a generic skill idea into a FosholHaat-specific skill.

Read these files first:

1. `/home/god_himself_wsl/FosholHaat-CSE299/CLAUDE.md`
2. `/home/god_himself_wsl/FosholHaat-CSE299/docs/skills-plan.md`
3. the source skill being adapted

Use this skill when:

- a generic skill is useful but too broad
- project-specific trigger language is missing
- you need a FosholHaat-focused version of an existing pattern

Forking rules:

- do not modify unrelated global/system skills when a project-specific fork is better
- preserve only the useful workflow pattern
- replace generic language with FosholHaat-specific triggers
- reference FosholHaat control docs directly
- keep the fork concise and operational

Forking sequence:

1. identify the source skill's useful core behavior
2. remove irrelevant scope
3. rewrite metadata for FosholHaat-specific triggers
4. add project-specific reading order
5. add daily-use guidance if the skill will be reused often
