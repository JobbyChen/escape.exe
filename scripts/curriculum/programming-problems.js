// Original problems, sequenced using the cited curriculum references.
export const programmingProblems = [
  {
    id: "max-three",
    title: "Choose the strongest signal",
    chapter: 2,
    difficulty: "Easy",
    skills: ["functions", "comparisons", "if/else"],
    objective:
      "Implement solve(a, b, c) returning the largest of three integers. Equal values and negative values are valid.",
    lesson:
      "A function takes changing inputs and returns a result. Track the best candidate instead of printing or hard-coding an example. In Java, write a static method inside the editor-provided Solution class. In Python, def introduces the function and return sends a value back. In Java, int before solve is the return type, parameters are typed, and static methods can be called without creating an object.",
    constraints: "-1000 <= a, b, c <= 1000. Return an integer; do not print.",
    params: [
      ["int", "a"],
      ["int", "b"],
      ["int", "c"],
    ],
    returns: "int",
    cases: [
      [[4, 9, 2], 9],
      [[-8, -2, -5], -2],
      [[7, 7, 1], 7],
      [[0, 0, 0], 0],
      [[12, 3, 12], 12],
      [[-3, -9, -1], -1],
    ],
    python:
      "def solve(a, b, c):\n    best = a\n    if b > best:\n        best = b\n    if c > best:\n        best = c\n    return best",
    java: "public static int solve(int a, int b, int c) {\n    int best = a;\n    if (b > best) { best = b; }\n    if (c > best) { best = c; }\n    return best;\n}",
    hints: [
      "Start with a as your current best.",
      "Compare both remaining candidates with best; ties must not erase it.",
    ],
    workedExamples: {
      python:
        "def entry_fee(age):\n    if age < 12:\n        return 0\n    return 5",
      java: "public static int entryFee(int age) {\n    if (age < 12) { return 0; }\n    return 5;\n}",
    },
  },
  {
    id: "delivery",
    title: "Route the supply convoy",
    chapter: 2,
    difficulty: "Easy",
    skills: ["Boolean logic", "boundaries", "piecewise rules"],
    objective:
      "Return delivery cost: weight <= 5 costs 8; weight 6..10 costs 12; heavier packages cost 20. Priority adds 7. Implement solve(weight, priority).",
    lesson:
      "Piecewise rules need mutually exclusive branches. First choose the base cost, then apply the independent priority surcharge once.",
    constraints:
      "1 <= weight <= 100. priority is Boolean. Return total integer cost.",
    params: [
      ["int", "weight"],
      ["boolean", "priority"],
    ],
    returns: "int",
    cases: [
      [[5, false], 8],
      [[6, true], 19],
      [[10, false], 12],
      [[11, true], 27],
      [[1, true], 15],
      [[100, false], 20],
    ],
    python:
      "def solve(weight, priority):\n    if weight <= 5:\n        cost = 8\n    elif weight <= 10:\n        cost = 12\n    else:\n        cost = 20\n    if priority:\n        cost += 7\n    return cost",
    java: "public static int solve(int weight, boolean priority) {\n    int cost;\n    if (weight <= 5) { cost = 8; }\n    else if (weight <= 10) { cost = 12; }\n    else { cost = 20; }\n    if (priority) { cost += 7; }\n    return cost;\n}",
    hints: [
      "Test the boundary weights 5, 6, 10, and 11.",
      "The priority check belongs after the weight branches, not inside only one branch.",
    ],
    workedExamples: {
      python: "def can_enter(has_key, active):\n    return has_key and active",
      java: "public static boolean canEnter(boolean hasKey, boolean active) {\n    return hasKey && active;\n}",
    },
  },
  {
    id: "even-total",
    title: "Recharge the even cells",
    chapter: 2,
    difficulty: "Easy",
    skills: ["for loops", "accumulators", "modulo"],
    objective:
      "Return the sum of all positive even integers up to and including n. Implement solve(n). For n below 2, return 0.",
    lesson:
      "An accumulator remembers a result across loop iterations. A modulo check identifies even values; the upper bound is inclusive.",
    constraints: "0 <= n <= 100. Return an integer.",
    params: [["int", "n"]],
    returns: "int",
    cases: [
      [[6], 12],
      [[7], 12],
      [[0], 0],
      [[1], 0],
      [[2], 2],
      [[20], 110],
    ],
    python:
      "def solve(n):\n    total = 0\n    for value in range(1, n + 1):\n        if value % 2 == 0:\n            total += value\n    return total",
    java: "public static int solve(int n) {\n    int total = 0;\n    for (int value = 1; value <= n; value++) {\n        if (value % 2 == 0) { total += value; }\n    }\n    return total;\n}",
    hints: [
      "Initialize total before the loop, not inside it.",
      "Either check value % 2 == 0 or step through even numbers only.",
    ],
    workedExamples: {
      python:
        "for index in range(3):\n    print(index)\n# Displays 0, then 1, then 2",
      java: "for (int index = 0; index < 3; index++) {\n    System.out.println(index);\n}",
    },
  },
  {
    id: "digit-sum",
    title: "Decode the signal checksum",
    chapter: 2,
    difficulty: "Easy",
    skills: ["while loops", "integer division", "termination"],
    objective:
      "Return the sum of the decimal digits of nonnegative n. Implement solve(n). The checksum of 0 is 0.",
    lesson:
      "The last digit is n % 10. Integer division removes that digit. Ensure every loop iteration makes progress toward termination.",
    constraints: "0 <= n <= 999999. Return an integer.",
    params: [["int", "n"]],
    returns: "int",
    cases: [
      [[472], 13],
      [[1005], 6],
      [[0], 0],
      [[9], 9],
      [[9999], 36],
      [[12030], 6],
    ],
    python:
      "def solve(n):\n    total = 0\n    while n > 0:\n        total += n % 10\n        n = n // 10\n    return total",
    java: "public static int solve(int n) {\n    int total = 0;\n    while (n > 0) {\n        total += n % 10;\n        n = n / 10;\n    }\n    return total;\n}",
    hints: [
      "Use modulo to read one digit and integer division to discard it.",
      "A while loop with an unchanged n never finishes.",
    ],
    workedExamples: {
      python:
        "remaining = 3\nwhile remaining > 0:\n    print(remaining)\n    remaining -= 1",
      java: "int remaining = 3;\nwhile (remaining > 0) {\n    System.out.println(remaining);\n    remaining--;\n}",
    },
  },
  {
    id: "count-above",
    title: "Audit the sensor array",
    chapter: 3,
    difficulty: "Easy",
    skills: ["arrays/lists", "iteration", "strict comparison"],
    objective:
      "Count values strictly greater than threshold. Implement solve(values, threshold). Empty input returns 0; equal values do not count.",
    lesson:
      "A collection contains changing inputs. Visit each value, test the condition, and increase a counter only when it passes.",
    constraints:
      "0 <= values length <= 30. Values and threshold are between -100 and 100.",
    params: [
      ["int[]", "values"],
      ["int", "threshold"],
    ],
    returns: "int",
    cases: [
      [[[2, 8, 8, 10], 8], 1],
      [[[], 3], 0],
      [[[-5, 0, 5], -1], 2],
      [[[4, 4], 4], 0],
      [[[9, 10, 11], 8], 3],
      [[[0], 0], 0],
    ],
    python:
      "def solve(values, threshold):\n    count = 0\n    for value in values:\n        if value > threshold:\n            count += 1\n    return count",
    java: "public static int solve(int[] values, int threshold) {\n    int count = 0;\n    for (int value : values) {\n        if (value > threshold) { count++; }\n    }\n    return count;\n}",
    hints: [
      "Keep the counter outside the loop.",
      "Strictly greater means >, not >=.",
    ],
    workedExamples: {
      python: "values = [4, 2, 9]\nfor value in values:\n    print(value)",
      java: "int[] values = {4, 2, 9};\nfor (int value : values) {\n    System.out.println(value);\n}",
    },
  },
  {
    id: "positive-run",
    title: "Find the stable transmission",
    chapter: 3,
    difficulty: "Medium",
    skills: ["stateful scans", "reset conditions", "best-so-far"],
    objective:
      "Return the length of the longest consecutive run of values greater than zero. Zero and negative values break a run. Implement solve(values).",
    lesson:
      "Track current run length and the best length separately. Reset current when the condition fails, but never reset best.",
    constraints:
      "0 <= values length <= 40; -100 <= value <= 100. Empty input returns 0.",
    params: [["int[]", "values"]],
    returns: "int",
    cases: [
      [[[1, 2, 0, 3, 4, 5]], 3],
      [[[-1, 0, -2]], 0],
      [[[]], 0],
      [[[4, 5, 6]], 3],
      [[[1, -1, 2, -2, 3]], 1],
      [[[0, 2, 3, 0, 4]], 2],
    ],
    python:
      "def solve(values):\n    current = 0\n    best = 0\n    for value in values:\n        if value > 0:\n            current += 1\n            if current > best:\n                best = current\n        else:\n            current = 0\n    return best",
    java: "public static int solve(int[] values) {\n    int current = 0;\n    int best = 0;\n    for (int value : values) {\n        if (value > 0) {\n            current++;\n            if (current > best) { best = current; }\n        } else { current = 0; }\n    }\n    return best;\n}",
    hints: [
      "You need two variables: current and best.",
      "Zero breaks the run just like a negative number.",
    ],
    workedExamples: {
      python:
        "current = 0\nsignal = 3\nif signal > 0:\n    current += 1\nelse:\n    current = 0",
      java: "int current = 0;\nint signal = 3;\nif (signal > 0) { current++; }\nelse { current = 0; }",
    },
  },
  {
    id: "encode-runs",
    title: "Compress the archive log",
    chapter: 3,
    difficulty: "Medium",
    skills: ["strings", "indexing", "state changes"],
    objective:
      "Run-length encode text: replace each consecutive group by its letter followed by its count. Example AAABB becomes A3B2. Empty text returns an empty string. Implement solve(text).",
    lesson:
      "Accumulate a group until the next character differs. Flush the previous group, reset its count, and remember to flush the final group after the loop.",
    constraints:
      "0 <= text length <= 30. Input contains uppercase English letters only.",
    params: [["String", "text"]],
    returns: "String",
    cases: [
      [["AAABB"], "A3B2"],
      [[""], ""],
      [["A"], "A1"],
      [["ABBA"], "A1B2A1"],
      [["ZZZZZ"], "Z5"],
      [["ABC"], "A1B1C1"],
    ],
    python:
      'def solve(text):\n    if len(text) == 0:\n        return ""\n    result = ""\n    count = 1\n    for i in range(1, len(text)):\n        if text[i] == text[i - 1]:\n            count += 1\n        else:\n            result = result + text[i - 1] + str(count)\n            count = 1\n    return result + text[-1] + str(count)',
    java: 'public static String solve(String text) {\n    if (text.length() == 0) { return ""; }\n    String result = "";\n    int count = 1;\n    for (int i = 1; i < text.length(); i++) {\n        if (text.charAt(i) == text.charAt(i - 1)) { count++; }\n        else {\n            result = result + text.charAt(i - 1) + count;\n            count = 1;\n        }\n    }\n    return result + text.charAt(text.length() - 1) + count;\n}',
    hints: [
      "Handle empty text before accessing a character.",
      "A group that reaches the end has no next character to trigger a flush.",
    ],
    workedExamples: {
      python:
        'text = "AB"\nfor index in range(len(text)):\n    print(text[index])',
      java: 'String text = "AB";\nfor (int index = 0; index < text.length(); index++) {\n    System.out.println(text.charAt(index));\n}',
    },
  },
  {
    id: "pair-sum",
    title: "Reconnect the paired nodes",
    chapter: 3,
    difficulty: "Medium",
    skills: ["nested loops", "distinct indices", "search"],
    objective:
      "Return true if two distinct array positions sum to target. The same position cannot be used twice, but equal values at different positions are allowed. Implement solve(values, target).",
    lesson:
      "For every index i, examine j starting at i + 1. This prevents self-pairs and duplicate pair work. Return early when a match is found.",
    constraints:
      "0 <= values length <= 30; -100 <= values and target <= 100. Return a Boolean.",
    params: [
      ["int[]", "values"],
      ["int", "target"],
    ],
    returns: "boolean",
    cases: [
      [[[2, 7, 11], 9], true],
      [[[3], 6], false],
      [[[3, 3], 6], true],
      [[[], 0], false],
      [[[-4, 1, 6], 2], true],
      [[[1, 2, 4], 8], false],
    ],
    python:
      "def solve(values, target):\n    for i in range(len(values)):\n        for j in range(i + 1, len(values)):\n            if values[i] + values[j] == target:\n                return True\n    return False",
    java: "public static boolean solve(int[] values, int target) {\n    for (int i = 0; i < values.length; i++) {\n        for (int j = i + 1; j < values.length; j++) {\n            if (values[i] + values[j] == target) { return true; }\n        }\n    }\n    return false;\n}",
    hints: [
      "A single 3 cannot form a pair summing to 6. Two separate 3s can.",
      "Start the inner loop at i + 1.",
    ],
    workedExamples: {
      python:
        "for row in range(2):\n    for column in range(3):\n        print(row, column)",
      java: 'for (int row = 0; row < 2; row++) {\n    for (int column = 0; column < 3; column++) {\n        System.out.println(row + "," + column);\n    }\n}',
    },
  },
  {
    id: "gcd",
    title: "Synchronize the core clocks",
    chapter: 4,
    difficulty: "Medium",
    skills: ["functions", "loop invariants", "Euclidean algorithm"],
    objective:
      "Return the greatest common divisor of nonnegative a and b. Define solve(0, 0) as 0. Use changing remainders rather than testing every possible divisor.",
    lesson:
      "The common divisors of a and b are unchanged when (a, b) becomes (b, a % b). Repeat until b is zero; a is then the answer.",
    constraints: "0 <= a, b <= 100000. Return an integer.",
    params: [
      ["int", "a"],
      ["int", "b"],
    ],
    returns: "int",
    cases: [
      [[48, 18], 6],
      [[0, 9], 9],
      [[7, 0], 7],
      [[0, 0], 0],
      [[17, 13], 1],
      [[100, 25], 25],
    ],
    python:
      "def solve(a, b):\n    while b != 0:\n        remainder = a % b\n        a = b\n        b = remainder\n    return a",
    java: "public static int solve(int a, int b) {\n    while (b != 0) {\n        int remainder = a % b;\n        a = b;\n        b = remainder;\n    }\n    return a;\n}",
    hints: [
      "Store the remainder before overwriting either input.",
      "The loop condition is b != 0, so modulo by zero is avoided.",
    ],
    workedExamples: {
      python: "def remainder(a, b):\n    return a % b\nprint(remainder(9, 4))",
      java: "public static int remainder(int a, int b) {\n    return a % b;\n}\n// Inside main: System.out.println(remainder(9, 4));",
    },
  },
  {
    id: "max-window",
    title: "Recover the strongest window",
    chapter: 4,
    difficulty: "Medium",
    skills: ["sliding window", "arrays", "negative inputs"],
    objective:
      "Return the largest sum of any consecutive block of exactly k values. Implement solve(values, k). All-negative inputs must return a negative answer when appropriate.",
    lesson:
      "Sum the first window. Moving one position adds the incoming value and removes the outgoing value. Initialize best from a real window, not zero.",
    constraints:
      "1 <= values length <= 30; 1 <= k <= values length; -100 <= value <= 100.",
    params: [
      ["int[]", "values"],
      ["int", "k"],
    ],
    returns: "int",
    cases: [
      [[[2, -1, 4, 3], 2], 7],
      [[[-8, -3, -5], 2], -8],
      [[[5], 1], 5],
      [[[1, 2, 3], 3], 6],
      [[[4, -9, 5, 6], 1], 6],
      [[[7, 0, 2, -1], 2], 7],
    ],
    python:
      "def solve(values, k):\n    current = 0\n    for i in range(k):\n        current += values[i]\n    best = current\n    for i in range(k, len(values)):\n        current += values[i] - values[i - k]\n        if current > best:\n            best = current\n    return best",
    java: "public static int solve(int[] values, int k) {\n    int current = 0;\n    for (int i = 0; i < k; i++) { current += values[i]; }\n    int best = current;\n    for (int i = k; i < values.length; i++) {\n        current += values[i] - values[i - k];\n        if (current > best) { best = current; }\n    }\n    return best;\n}",
    hints: [
      "For [-8, -3, -5] with k=2, zero is not a candidate window.",
      "Each movement changes only two values in the running sum.",
    ],
    workedExamples: {
      python:
        "current = 3 + 1\n# Slide from [3, 1] to [1, 4].\ncurrent = current - 3 + 4\nprint(current)",
      java: "int current = 3 + 1;\n// Slide from [3, 1] to [1, 4].\ncurrent = current - 3 + 4;\nSystem.out.println(current);",
    },
  },
  {
    id: "binary-search",
    title: "Search the ordered memory",
    chapter: 4,
    difficulty: "Medium",
    skills: ["binary search", "bounds", "algorithmic complexity"],
    objective:
      "Return the index of target in a sorted array of unique integers, or -1 if absent. Implement solve(values, target) using a shrinking search interval.",
    lesson:
      "Maintain inclusive left/right bounds. Compare the middle value, discard the impossible half, and ensure either left increases or right decreases.",
    constraints:
      "0 <= values length <= 40; sorted unique integers between -100 and 100. Target may be absent.",
    params: [
      ["int[]", "values"],
      ["int", "target"],
    ],
    returns: "int",
    cases: [
      [[[-5, 0, 4, 9], 4], 2],
      [[[], 3], -1],
      [[[2], 2], 0],
      [[[2], 1], -1],
      [[[1, 4, 7, 10], 10], 3],
      [[[1, 4, 7, 10], 6], -1],
    ],
    python:
      "def solve(values, target):\n    left = 0\n    right = len(values) - 1\n    while left <= right:\n        middle = (left + right) // 2\n        if values[middle] == target:\n            return middle\n        if values[middle] < target:\n            left = middle + 1\n        else:\n            right = middle - 1\n    return -1",
    java: "public static int solve(int[] values, int target) {\n    int left = 0;\n    int right = values.length - 1;\n    while (left <= right) {\n        int middle = (left + right) / 2;\n        if (values[middle] == target) { return middle; }\n        if (values[middle] < target) { left = middle + 1; }\n        else { right = middle - 1; }\n    }\n    return -1;\n}",
    hints: [
      "An empty array starts with right = -1.",
      "Do not leave middle inside the next interval after it has failed the test.",
    ],
    workedExamples: {
      python:
        "left = 0\nright = 4\nmiddle = (left + right) // 2\n# If the target is larger than the middle value:\nleft = middle + 1",
      java: "int left = 0;\nint right = 4;\nint middle = (left + right) / 2;\n// If target is larger than the middle value:\nleft = middle + 1;",
    },
  },
  {
    id: "trade-profit",
    title: "Restore the resource exchange",
    chapter: 4,
    difficulty: "Medium",
    skills: ["one-pass algorithms", "ordering constraints", "mixed review"],
    objective:
      "Return the largest nonnegative profit from buying once and selling on a later day. If no profitable trade exists, return 0. Implement solve(prices).",
    lesson:
      "Remember the cheapest price seen so far and the best profit. A buy must come before its sale; subtracting the global minimum from the global maximum can violate this order.",
    constraints:
      "0 <= prices length <= 40; 0 <= price <= 1000. Buying and selling are optional.",
    params: [["int[]", "prices"]],
    returns: "int",
    cases: [
      [[[7, 1, 5, 3, 6, 4]], 5],
      [[[9, 7, 4]], 0],
      [[[]], 0],
      [[[3]], 0],
      [[[2, 8, 1, 4]], 6],
      [[[4, 4, 4]], 0],
    ],
    python:
      "def solve(prices):\n    if len(prices) == 0:\n        return 0\n    cheapest = prices[0]\n    best = 0\n    for price in prices:\n        if price < cheapest:\n            cheapest = price\n        profit = price - cheapest\n        if profit > best:\n            best = profit\n    return best",
    java: "public static int solve(int[] prices) {\n    if (prices.length == 0) { return 0; }\n    int cheapest = prices[0];\n    int best = 0;\n    for (int price : prices) {\n        if (price < cheapest) { cheapest = price; }\n        int profit = price - cheapest;\n        if (profit > best) { best = profit; }\n    }\n    return best;\n}",
    hints: [
      "The maximum price might appear before the minimum price.",
      "Process days in order, keeping only the cheapest earlier price and best profit.",
    ],
    workedExamples: {
      python:
        "cheapest = 7\nnext_price = 3\ncheapest = min(cheapest, next_price)\nprint(cheapest)",
      java: "int cheapest = 7;\nint nextPrice = 3;\ncheapest = Math.min(cheapest, nextPrice);\nSystem.out.println(cheapest);",
    },
  },
];
