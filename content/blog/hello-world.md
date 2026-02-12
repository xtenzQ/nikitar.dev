---
title: Hello World
description: My first blog post — testing syntax highlighting, math formulas, and Markdown rendering.
date: '2025-02-12'
tags:
  - intro
  - java
draft: false
---

Welcome to my blog! This is a placeholder post to verify that everything works correctly — syntax highlighting, math formulas, blockquotes, and more.

## A Java Example

Here's a simple Spring Boot controller:

```java
@RestController
@RequestMapping("/api/greetings")
public class GreetingController {

    @GetMapping("/{name}")
    public String greet(@PathVariable String name) {
        return "Hello, " + name + "!";
    }
}
```

## Python Example

A quick machine learning snippet:

```python
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

model = LogisticRegression()
model.fit(X_train, y_train)
print(f"Accuracy: {model.score(X_test, y_test):.2%}")
```

## TypeScript Example

```typescript
interface BlogPost {
  title: string;
  date: string;
  tags: string[];
  draft: boolean;
}

function formatPost(post: BlogPost): string {
  const tagList = post.tags.join(', ');
  return `${post.title} (${post.date}) [${tagList}]`;
}
```

## Math Formulas

Inline math works too: $E = mc^2$ and $\sum_{i=1}^{n} i = \frac{n(n+1)}{2}$.

The quadratic formula:

$$
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$

The Gaussian integral:

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

Euler's identity:

$$
e^{i\pi} + 1 = 0
$$

## Blockquote

> The best way to predict the future is to invent it.
> — Alan Kay

## What to Expect

I plan to write about:

- Backend development with **Java** and **Kotlin**
- Machine learning experiments
- System design and architecture
- Developer tools and productivity

Some `inline code` for testing too.

Stay tuned!
