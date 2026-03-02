---
title: Form Validation
description: Form fields with validation states showing errors and success.
tags:
  - form
---

## Error

```
Email
┌──────────────────────────┐
│ invalid-email            │
└──────────────────────────┘
! Please enter a valid email address

Password
┌──────────────────────────┐
│ ***                      │
└──────────────────────────┘
! Must be at least 8 characters
```

## Success

```
Email
┌──────────────────────────┐
│ alice@example.com        │
└──────────────────────────┘
v Email is available

Password
┌──────────────────────────┐
│ ********                 │
└──────────────────────────┘
v Strong password
```

## Mixed

```
Username
┌──────────────────────────┐
│ alice                    │
└──────────────────────────┘
v Username is available

Email
┌──────────────────────────┐
│ alice@                   │
└──────────────────────────┘
! Please enter a valid email address

Password
┌──────────────────────────┐
│ ****                     │
└──────────────────────────┘
! Must be at least 8 characters
```
