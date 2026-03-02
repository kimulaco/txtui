---
title: Table
description: Data tables for displaying structured information in rows and columns.
tags:
  - data-display
  - display
  - grid
---

## Basic

```
┌────┬──────────┬────────┬────────┐
│ ID │ Name     │ Role   │ Status │
├────┼──────────┼────────┼────────┤
│  1 │ Alice    │ Admin  │ Active │
│  2 │ Bob      │ Editor │ Active │
│  3 │ Charlie  │ Viewer │ Idle   │
└────┴──────────┴────────┴────────┘
```

## Borderless

```
 ID  Name      Role    Status
 --- --------- ------- -------
  1  Alice     Admin   Active
  2  Bob       Editor  Active
  3  Charlie   Viewer  Idle
```

## With Status

```
┌────┬──────────┬────────┬──────────┐
│ ID │ Name     │ Role   │ Status   │
├────┼──────────┼────────┼──────────┤
│  1 │ Alice    │ Admin  │ * Active │
│  2 │ Bob      │ Editor │ * Active │
│  3 │ Charlie  │ Viewer │ - Idle   │
│  4 │ Diana    │ Editor │ ~ Away   │
└────┴──────────┴────────┴──────────┘
```
