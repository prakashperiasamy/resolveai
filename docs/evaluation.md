# Evaluation plan

The synthetic demo has no measured production benefits. A production pilot should establish its baseline before setting numerical improvement targets.

| Measure | Definition | Evaluation approach |
|---|---|---|
| Triage time | Time from case creation to agreed owner and next action | Compare matched case groups and record human review time |
| Blocked age | Days in a blocked state, by cause and severity | Preserve state-transition history and distinguish waits from work |
| QA-to-release time | Time from accepted fix to validated release | Track rework and approval delays |
| Recurrence | Repeated confirmed failure pattern after a validated fix | Use an engineer-reviewed recurrence definition |
| AI reliability | Unsupported assertions and incorrect or inaccessible citations | Expert review on a held-out evaluation set |
| Adoption | Repeat use by the intended engineering roles | Observe task completion and decision usefulness |

Control for case severity, configuration complexity, staffing, and release timing. Measure coverage and false recommendations alongside speed. A faster answer with weaker evidence is not a successful result.
