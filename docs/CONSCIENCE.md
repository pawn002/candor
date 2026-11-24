# Conscience

Visual design exists to help people understand, navigate, and act. The test is always whether someone using a surface can do what they came to do. Passing an audit, satisfying an aesthetic and showing that the system was carefully built are different achievements, and confusing them is how a design system ends up constraining the people it was built to help.

---

## What design systems get wrong

Design systems fail in predictable ways, regardless of their quality or intentions.

**Systematization becomes the goal.** The system starts optimizing for its own coherence. Tokens multiply, rules accumulate, and the measure of quality shifts from "does this work for people" to "does this follow the system." The system becomes the client.

**Compliance replaces the problem.** Passing an audit stands in for solving the accessibility problem. Meeting a contrast threshold stands in for legibility. The checklist is completed; the user is still struggling.

**Opinions become constraints.** Strong aesthetic convictions — humanist framing, perceptual uniformity, typographic discipline — produce better defaults. They also produce blind spots. Every strong opinion about what design should look like is a claim that can be wrong in specific contexts.

**No feedback loop.** The system has a clear view of what it requires and no mechanism for learning whether those requirements are producing good outcomes for the people it was built to serve.

---

## Candor's specific risks

Each of Candor's risks is one of its strengths, applied without checking whether it still fits.

**The humanist frame as orthodoxy.** Candor holds that every surface should feel like it was made by the same hand. There are contexts where this is wrong — where a user needs maximum legibility with minimum cognitive overhead, and warmth is a distraction. The humanist framing could override that judgment without it being noticed.

**OKCA as sufficient.** OKCA is the primary validation method. Contrast algorithms answer one question. They do not answer whether text communicates urgency, whether color carries the right meaning for a specific user population, or whether hierarchy tells the right story.

**Token discipline as principle.** "No hard-coded values, ever" is a rule that serves auditability and adjustability. There are cases where a specific value is correct and a token would add a name with nothing behind it.

**Perceptual uniformity as truth.** OKLCH models human vision well, but it is still a model. Specific users in specific contexts will perceive things the model does not predict.

**The four-voice system as canon.** The typeface choices are good choices. They may not be correct for every context a Candor consumer serves. A system that cannot accommodate legitimate deviation has become a constraint.

---

## Questions Candor must keep answering

None of these has a final answer. They're worth asking again at every release.

- Are people using surfaces built with Candor able to do what they came to do?
- Is the system's coherence serving users, or serving itself?
- Where has the humanist frame overridden a judgment that should have gone the other way?
- Which rules are load-bearing and which have become tradition?
- Who is not in Candor's user model, and what does the system assume about them?
- Is the contrast methodology catching real failures, or producing passing scores?
- What would a serious critic of Candor say, and is that critic right?

---

Candor does not have the final word on what works for people. The people do.
